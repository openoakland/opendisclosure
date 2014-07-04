require_relative 'socrata_fetcher.rb'
require 'active_record'
require 'open-uri'
require 'csv-mapper'

# Connect and set up the database
$LOAD_PATH << '.'
ENV['DATABASE_URL'] ||= "postgres://localhost/postgres"
ActiveRecord::Base.establish_connection ENV['DATABASE_URL']
require_relative 'schema.rb'
Dir[File.dirname(__FILE__) + '/models/*.rb'].each { |f| require f }

URLS = {
  'Schedule A' => 'http://data.oaklandnet.com/resource/3xq4-ermg.json',
  'Schedule E' => 'http://data.oaklandnet.com/resource/bvfu-nq99.json',
  'Summary'    => 'http://data.oaklandnet.com/resource/rsxe-vvuw.json',
}.freeze

class Map < ActiveRecord::Base; end
class Lobbyist < ActiveRecord::Base; end

def parse_contributions(row)
  recipient = Party::Committee.where(committee_id: row['filer_id'])
                              .first_or_create(name: row['filer_naml'])

  contributor =
    case row['entity_cd']
    when 'COM', 'SCC'
      # contributor is a Committee and Cmte_ID is set. Same thing as
      # Filer_ID but some names disagree
      Party::Committee.where(committee_id: row['cmte_id'])
                      .first_or_create(name: row['tran_naml'])

    when 'IND'
      # contributor is an Individual
      full_name = row.values_at('tran_namt', 'tran_namf', 'tran_naml', 'tran_nams')
                     .join(' ')
                     .strip
      Party::Individual.where(name: full_name,
                              city: row['tran_city'],
                              state: row['tran_state'],
                              zip: row['tran_zip4'])
                       .first_or_create(employer: row['tran_emp'],
                                        occupation: row['tran_occ'])
    when 'OTH'
      # contributor is "Other"
      Party::Other.where(name: row['tran_naml'])
                  .first_or_create(city: row['tran_city'],
                                   state: row['tran_state'],
                                   zip: row['tran_zip4'])
    end

  Contribution.create(recipient: recipient,
                      contributor: contributor,
                      amount: row['tran_amt1'],
                      date: row['tran_date'])
end

def parse_payments(row)
  payer = Party::Committee.where(committee_id: row['filer_id'])
                          .first_or_create(name: row['filer_naml'])
  recipient =
    case row['entity_cd']
    when 'COM', 'SCC'
      # entity being paid is a Committee and Cmte_ID will be set. Same thing as
      # Filer_ID but some names disagree
      Party::Committee.where(committee_id: row['cmte_id'])
                      .first_or_create(name: row['payee_naml'])

    when 'IND'
      # entity being paid is an Individual
      full_name = row.values_at('payee_namt', 'payee_naml', 'payee_namf', 'payee_nams')
                     .join(' ')
                     .strip
      Party::Individual.where(name: full_name,
                              city: row['payee_city'],
                              state: row['payee_state'],
                              zip: row['payee_zip4'])
                       .first_or_create
    when 'OTH'
      # payee is "Other"
      Party::Other.where(name: row['payee_naml'])
                  .first_or_create(city: row['payee_city'],
                                   state: row['payee_state'],
                                   zip: row['payee_zip4'])
    end

  Payment.create(payer: payer,
                 recipient: recipient,
                 amount: row['amount'],
                 date: row['expn_date'])
end

# Hash of:
# Form_Type => { Line_Item => SQL Column name }
SUMMARY_LINES = {
  'F460' => {
    '1'  => :total_monetary_contributions,
    '5'  => :total_contributions_received,
    '11' => :total_expenditures_made,
    '16' => :ending_cash_balance,
  },
  'A' => {
    '2' => :total_unitemized_contributions,
  },
}.freeze

def parse_summary(row)
  return unless SUMMARY_LINES.include? row['form_type']
  return unless SUMMARY_LINES[row['form_type']].include? row['line_item']
  return if row['filer_id'] == 'Pending' || row['filer_id'].to_i == 0

  column = SUMMARY_LINES[row['form_type']][row['line_item']]
  value = row['amount_a']
  summary = Summary.where(party_id: row['filer_id'])
                   .first_or_create

  # HACK / Naming convention:
  # The "Total" fields (i.e. :total_monetary_contributions) are reported
  # on each summary sheet for that period only. This means to calculate a true
  # total, we need to add the values from each of the summary sheets.
  if column =~ /^total/
    summary.update_attributes(
      column => (summary[column] || 0) + value.to_i,
      :last_summary_date => row['thru_date']
    )
  else
    summary.update_attributes(
      column => value,
      :last_summary_date => row['thru_date']
    )
  end
end

if __FILE__ == $0
  if ENV['LOG'] == "true"
    ActiveRecord::Base.logger = Logger.new(STDOUT)
  end

  # This table maps spellings of employers to a common spelling.
  # It needs to be updated when a new batch of data is available
  # as there is no check on spelling on the forms.
  puts "Loading Employer Map"
  include CsvMapper
  results = import('backend/map.csv') do
    map_to Map
    after_row lambda{|row, map| map.save}
    start_at_row 1
    [id, emp1, emp2, type]
  end

  # !! Need a new Lobbyist Directory for 2014
  puts "Loading Lobbyist data"
  results = import('backend/2013_Lobbyist_Directory.csv') do
    map_to Lobbyist
    after_row lambda{|row, lobbyist| lobbyist.save}
    start_at_row 1
    [id, name, firm]
  end

  puts "Fetching Contribution data (Schedule A) from Socrata:"
  Party.transaction do #        <- speed hack for sqlite3
    SocrataFetcher.new(URLS['Schedule A']).each do |record|
      parse_contributions(record)
    end
  end

  puts "Fetching Expense data (Schedule E) from Socrata:"
  Party.transaction do
    SocrataFetcher.new(URLS['Schedule E']).each do |record|
      parse_payments(record)
    end
  end

  puts "Fetching Summary data from Socrata:"
  Summary.transaction do
    SocrataFetcher.new(URLS['Summary']).each do |record|
      parse_summary(record)
    end
  end

  puts "Run analysis"
  ActiveRecord::Base.connection.execute <<-QUERY
    INSERT into category_contributions(recipient_id, name, contype, number, amount)
    SELECT
      r.id,
      r.name,
      case
        when c.type = 'Party::Other' then
          case
            when maps.type = 'Union' then 'Union'
            when l.firm is not null then 'Lobbyist'
          else 'Company'
          end
        when c.type = 'Party::Individual' AND
            l.name is not null OR l.firm is not null then 'Lobbyist'
        else substring(c.type, 8)
      end as ConType, count(*), sum(amount)
    FROM
      contributions cont,
      parties r,
      (parties c
      left outer join maps on name = emp2
      left outer join lobbyists l on
         c.name = l.name or c.name = l.firm or c.employer = l.firm)
    WHERE
      r.committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','}) AND
      r.id = recipient_id AND
      c.id = contributor_id
    GROUP BY
      r.id, r.name, ConType
    ORDER BY
      r.id, r.name, sum(amount) desc;
  QUERY

  ActiveRecord::Base.connection.execute <<-QUERY
    INSERT into employer_contributions(recipient_id, name, contrib, amount)
    SELECT s.id, candidate, contrib, sum(amount) as amount from
      (
        SELECT r.id, r.name as candidate,
         case
           when p.Emp1 = 'N/A' then c.occupation
           else p.Emp1
         end as contrib, amount
          FROM contributions b, parties r, parties c, maps p
          WHERE b.recipient_id = r.id AND b.contributor_id = c.id and
          r.committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','}) AND
          c.employer = p.Emp2 AND c.type = 'Party::Individual'
        UNION ALL
        SELECT r.id, r.name as candidate, p.Emp1 as contrib, amount
          FROM contributions b, parties r, parties c, maps p
          WHERE b.recipient_id = r.id AND b.contributor_id = c.id and
          r.committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','}) AND
          c.name = p.Emp2 AND c.type <> 'Party::Individual'
       ) s
    GROUP BY s.id, candidate, contrib
    ORDER BY s.id, candidate, sum(amount) desc;
  QUERY

  ActiveRecord::Base.connection.execute <<-QUERY
    INSERT into whales(contributor_id, amount)
    SELECT contributor_id, sum(amount)
    FROM contributions, parties
    WHERE amount IS NOT NULL AND recipient_id = parties.id AND committee_id <> 0 AND
      ( committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','}) OR
	committee_id in (#{Party::CANDIDATE_IDS.join ','}))
    GROUP BY contributor_id
    ORDER BY sum(amount) desc
    LIMIT 10;
  QUERY

  ActiveRecord::Base.connection.execute <<-QUERY
    INSERT into multiples(contributor_id, number)
    SELECT contributor_id, count(distinct recipient_id) 
    FROM contributions, parties r
    WHERE r.id = recipient_id AND
      r.committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','})
    GROUP BY contributor_id
    HAVING count(distinct recipient_id) > 1
    ORDER BY count(distinct recipient_id) desc;
  QUERY
end

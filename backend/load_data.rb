require 'active_record'
require 'open-uri'

Dir['./models/*.rb'].each { |f| require f }

# In order to connect, set ENV['DATABASE_URL'] to the database you wish to
# populate
ActiveRecord::Base.establish_connection
%w(parties contributions summaries).each do |table|
  ActiveRecord::Base.connection.execute('drop table if exists ' + table)
end
#ActiveRecord::Base.logger = Logger.new(STDOUT) # <- uncomment to see everything

ActiveRecord::Schema.define do
  create_table :parties do |t|
    t.string :type, null: false    # Individual, Other, Committee
    t.string :name, null: false
    t.string :city
    t.string :state
    t.integer :zip
    t.integer :committee_id # 0 = pending
    t.string :employer
    t.string :occupation

    t.index [:committee_id, :type]
    t.index [:type, :name, :city, :state]
  end

  create_table :contributions do |t|
    t.integer :contributor_id, null: false
    t.integer :recipient_id, null: false
    t.integer :amount
    t.date :date

    t.index :recipient_id
    t.index :contributor_id
  end

  create_table :summaries do |t|
    t.integer :party_id, null: false
    t.integer :total_contributions_received
    t.integer :total_expenditures_made
    t.integer :ending_cash_balance

    t.index :party_id
  end
end

class SocrataFetcher
  def initialize(uri)
    @uri = URI(uri)
  end

  def each_batch
    more = true
    offset = 0
    while more
      url = @uri
      url.query = URI.encode_www_form(
        '$limit' => 1000,
        '$offset' => offset
      )
      puts url.to_s

      response = JSON.parse(open(url.to_s).read)
      yield response

      # preparation for next loop!
      more = response.length > 0
      offset = offset + 1000
    end
  end
end

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

if __FILE__ == $0
  SocrataFetcher.new('http://data.oaklandnet.com/resource/3xq4-ermg.json').each_batch do |batch|
    Party.transaction do #        <- speed hack for sqlite3
      batch.each do |record|
        parse_contributions(record)
      end
    end
  end
end

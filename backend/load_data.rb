require 'active_record'
require 'open-uri'

Dir['./models/*.rb'].each { |f| require f }

# In order to connect, set ENV['DATABASE_URL'] to the database you wish to
# populate
ActiveRecord::Base.establish_connection
%w(parties contributions summaries).each do |table|
  ActiveRecord::Base.connection.execute('drop table if exists ' + table)
end

ActiveRecord::Schema.define do
  create_table :parties do |t|
    t.string :type    # Individual, Other, Committee
    t.string :name
    t.string :city
    t.string :state
    t.integer :zip
    t.integer :committee_id # 0 = pending
    t.string :employer
    t.string :occupation

    t.index :committee_id
    t.index [:name, :city, :state]
  end

  create_table :contributions do |t|
    t.integer :contributor_id
    t.integer :recipient_id
    t.integer :amount
    t.date :date

    t.index :recipient_id
    t.index :contributor_id
  end

  create_table :summaries do |t|
    t.integer :party_id
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

  def each_record
    more = true
    offset = 0
    while more
      url = @uri
      url.query = URI.encode_www_form(
        '$where' => Party.mayoral_candidates
                         .keys
                         .map { |c| "filer_naml='#{c.name}'" }
                         .join(' OR '),
        '$limit' => 1000,
        '$offset' => offset
      )

      response = open(url.to_s).read.split("\n")
      response.each do |record|
        yield record
      end

      # preparation for next loop!
      more = response.length > 0
      offset = offset + 1000
    end
  end
end

def parse_contributions(row)
  recipient = Party.where(committee_id: row['Filer_ID'])
                   .first_or_create(name: row['Filer_NamL'])

  contributor =
    case row['Entity_Cd']
    when 'COM', 'SCC'
      # contributor is a Committee and Cmte_ID is set. Same thing as
      # Filer_ID but some names disagree
      Party.where(committee_id: row['Cmte_ID'])
           .first_or_create(name: row['Tran_NamL'],
                            type: 'Committee')
    when 'IND'
      # contributor is an Individual
      full_name = row.values_at('Tran_NamT', 'Tran_NamF', 'Tran_NamL', 'Tran_NamS')
                     .join(' ')
                     .strip
      Party.where(name: full_name,
                  city: row['Tran_City'],
                  state: row['Tran_State'],
                  zip: row['Tran_Zip4'])
           .first_or_create(employer: row['Tran_Emp'],
                            occupation: row['Tran_Occ'],
                            type: 'Individual')
    when 'OTH'
      # contributor is "Other"
      Party.where(name: row['Tran_NamL'])
           .first_or_create(city: row['Tran_City'],
                            state: row['Tran_State'],
                            zip: row['Tran_Zip4'],
                            type: 'Other')
    end

  Contribution.create(recipient: recipient,
                      contributor: contributor,
                      amount: row['Tran_Amt1'],
                      date: row['Tran_Date'])
end

if __FILE__ == $0
  SocrataFetcher.new('http://data.oaklandnet.com/resource/3xq4-ermg.json').each_record do |record|
    parse_contributions(record)
  end
end

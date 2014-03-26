require 'active_record'
require 'roo'

Dir['./models/*.rb'].each { |f| require f }

# In order to connect, set ENV['DATABASE_URL'] to the database you wish to
# populate
ActiveRecord::Base.establish_connection

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
  end

  create_table :contributions do |t|
    t.integer :contributor_id
    t.integer :recipient_id
    t.integer :amount
    t.date :date
  end

  create_table :summaries do |t|
    t.integer :party_id
    t.integer :total_contributions_received
    t.integer :total_expenditures_made
    t.integer :ending_cash_balance
  end
end

def parse_file(filename)
  workbook = Roo::Excelx.new(filename)
  parse_contributions_schedule_a(workbook)
end

def parse_contributions_schedule_a(workbook)
  workbook.default_sheet = 'A-Contributions'
  headers = workbook.row(1)

  # Parse each row of the spreadsheet
  (2..workbook.last_row).each do |row_id|
    row = Hash[headers.zip(workbook.row(row_id))]

    parse_contribution(row)
  end
end

def parse_contribution(row)
  recipient = Committee.where(committee_id: row['Filer_ID'])
                       .first_or_create(name: row['Filer_NamL'],
                                        committee_type: row['Committee_Type'])
  contributor =
    case row['Entity_Cd']
    when 'COM', 'SCC'
      # contributor is a Committee and Cmte_ID is set. Same thing as
      # Filer_ID but some names disagree
      Committee.from_row(row)#where(committee_id: row['Cmte_ID'])
               #.first_or_create(name: row['Tran_NamL'])
    when 'IND'
      # contributor is an Individual
      full_name = row.values_at('Tran_NamT', 'Tran_NamF', 'Tran_NamL', 'Tran_NamS')
                     .join(' ')
                     .strip
      Individual.where(name: full_name,
                       city: row['Tran_City'],
                       state: row['Tran_State'],
                       zip: row['Tran_Zip4'])
                 .first_or_create(employer: row['Tran_Emp'],
                                  occupation: row['Tran_Occ'])
    when 'OTH'
      # contributor is "Other"
      OtherContributor.where(name: row['Tran_NamL'])
                      .first_or_create(city: row['Tran_City'],
                                       state: row['Tran_State'],
                                       zip: row['Tran_Zip4'])
    end

  Contribution.create(recipient: recipient,
                      contributor: contributor,
                      amount: row['Tran_Amt1'],
                      date: row['Tran_Date'])
end

if __FILE__ == $0
  parse_file('../assets/data/efile_COAK_2013.xlsx')
end

require 'active_record'

ActiveRecord::Schema.define do
  ActiveRecord::Base.connection.tables.each do |table_to_drop|
    drop_table table_to_drop
  end

  create_table :parties do |t|
    t.string :type, null: false    # Individual, Other, Committee
    t.string :name, null: false
    t.string :city
    t.string :state
    t.integer :zip
    t.integer :committee_id # 0 = pending
    t.string :employer
    t.integer :employer_id
    t.string :occupation

    t.integer :received_contributions_count, null: false, default: 0
    t.integer :received_contributions_from_oakland, null: false, default: 0
    t.integer :small_contributions, null: false, default: 0
    t.integer :contributions_count, null: false, default: 0
    t.integer :self_contributions_total, null: false, default: 0

    t.index [:committee_id, :type]
    t.index [:type, :name, :city, :state]
  end

  create_table :employers do |t|
    t.string :employer_name, null: false

    t.index :employer_name
  end

  create_table :contributions do |t|
    t.integer :contributor_id, null: false
    t.integer :recipient_id, null: false
    t.integer :amount
    t.date :date
    t.integer :type

    t.index :recipient_id
    t.index :contributor_id

    t.boolean :self_contribution, null: false, default: false
  end

  create_table :payments do |t|
    t.integer :payer_id, null: false
    t.integer :recipient_id, null: false
    t.integer :amount
    t.date :date

    t.index :payer_id
    t.index :recipient_id
  end

  create_table :summaries do |t|
    t.integer :party_id, null: false
    t.date :last_summary_date

    # From Summary sheet:
    t.integer :total_monetary_contributions
    t.integer :total_nonmonetary_contributions
    t.integer :total_contributions_received
    t.integer :total_unpaid_bills
    t.integer :total_expenditures_made
    t.integer :total_misc_increases_to_cash
    t.integer :ending_cash_balance

    # From Schedule A summary:
    t.integer :total_unitemized_contributions

    t.index :party_id, unique: true
  end
  create_table :maps do |t|
    t.string :emp1, null: false
    t.string :emp2, null: false
    t.string :type, null: true

    t.index [:emp2 ], unique: true
  end
  create_table :category_contributions do |t|
    t.integer :recipient_id, null: false
    t.string :name, null: false
    t.string :contype, null: false
    t.integer :number, null: false
    t.integer :amount, null: false

    t.index [:recipient_id]
  end
  create_table :employer_contributions do |t|
    t.integer :recipient_id, null: false
    t.integer :employer_id
    t.string :name, null: false
    t.string :contrib, null: false
    t.integer :amount, null: false

    t.index [:recipient_id]
  end
  create_table :whales do |t|
    t.integer :contributor_id, null: false
    t.integer :amount
  end
  create_table :multiples do |t|
    t.integer :contributor_id, null: false
    t.integer :number
  end

  create_table :lobbyists do |t|
    t.string :name
    t.string :firm

    t.index [:name], unique: true
    t.index [:firm]
  end

  create_table :imports do |t|
    t.datetime :import_time
  end
end

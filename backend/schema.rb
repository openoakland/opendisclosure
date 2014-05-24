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
    t.string :occupation

    t.integer :received_contributions_count, null: false, default: 0
    t.integer :received_contributions_from_oakland, null: false, default: 0
    t.integer :small_donations, null: false, default: 0
    t.integer :contributions_count, null: false, default: 0

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
    t.integer :total_unitemized_contributions
    t.integer :total_monetary_contributions
    t.integer :total_contributions_received
    t.integer :total_expenditures_made
    t.integer :ending_cash_balance

    t.index :party_id, unique: true
  end
end

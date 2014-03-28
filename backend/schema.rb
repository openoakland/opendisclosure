require 'active_record'

ActiveRecord::Schema.define do
  drop_table :parties
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

  drop_table :contributions
  create_table :contributions do |t|
    t.integer :contributor_id, null: false
    t.integer :recipient_id, null: false
    t.integer :amount
    t.date :date

    t.index :recipient_id
    t.index :contributor_id
  end

  drop_table :summaries
  create_table :summaries do |t|
    t.integer :party_id, null: false
    t.date :date
    t.integer :total_unitemized_contributions
    t.integer :total_monetary_contributions
    t.integer :total_contributions_received
    t.integer :total_expenditures_made
    t.integer :ending_cash_balance

    t.index [:party_id, :date], unique: true
  end
end

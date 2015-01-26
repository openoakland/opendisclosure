FactoryGirl.define do
  factory 'contribution' do
    sequence(:transaction_id)
    amount 100
    association :contributor, factory: 'party/individual'
    association :recipient, factory: 'party/committee'
  end
end

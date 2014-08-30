FactoryGirl.define do
  factory :committee, class: Party::Committee do
    sequence(:committee_id)
    name "Anything Committee"
  end
end

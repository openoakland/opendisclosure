FactoryGirl.define do
  factory 'party/individual' do
    name 'Foo Party'
  end

  factory 'party/committee' do
    name 'Foo Party'
    committee_id 1234567
  end
end

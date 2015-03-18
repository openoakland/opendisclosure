class Party < ActiveRecord::Base
  has_many :received_contributions,
    foreign_key: :recipient_id,
    class_name: 'Contribution'
  has_many :contributions,
    foreign_key: :contributor_id,
    class_name: 'Contribution'
  has_one :summary, primary_key: :committee_id
  has_many :whales,
    foreign_key: :contributor_id,
    class_name: 'Whale'
  has_many :multiples,
    foreign_key: :contributor_id,
    class_name: 'Multiple'

  def link_path
    '/candidate/' + name.downcase.gsub(/[^a-z]/, '-')
  end

  def from_oakland?
    city =~ /Oakland/i
  end
end

class Party::Individual < Party
end

class Party::Other < Party
end

class Party::Committee < Party
end

class CommitteeMap < ActiveRecord::Base
end

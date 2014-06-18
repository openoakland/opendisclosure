class Party < ActiveRecord::Base
  has_many :received_contributions,
    foreign_key: :recipient_id,
    class_name: 'Contribution'
  has_many :contributions,
    foreign_key: :contributor_id,
    class_name: 'Contribution'
  has_one :summary, primary_key: :committee_id

  # These are the Filer_IDs of the candidates
  MAYORAL_CANDIDATE_IDS = [
    PARKER = 1357609,
    QUAN = 1354678,
    SCHAAF = 1362261,
    TUMAN = 1359017,
    MCCULLOUGH = 0,   # TODO: Fill in with Filer_ID when he has one
    RUBY = 1342695,   # TODO: This is wrong, fix it!!!
  ]

  CANDIDATE_INFO = {
    PARKER => {
      name: 'Bryan Parker',
      profession: 'Health Care and Tecnology Professional',
      party: 'Democrat'
    },
    QUAN => {
      name: 'Jean Quan',
      profession: 'Incumbant Oakland Mayor',
      party: 'Democrat'
    },
    SCHAAF => {
      name: 'Libby Schaaf',
      profession: 'Councilmember for District 4',
      party: 'Democrat'
    },
    TUMAN => {
      name: 'Joe Tuman',
      profession: 'University Professor',
      party: 'Independent'
    },
    MCCULLOUGH => {
      name: 'Patrick McCullough',
      profession: '<current profession>',
      party: 'Unknown',
    },
    RUBY => {
      name: 'Courtney Ruby',
      profession: '<current profession>',
      party: 'Unknown',
    }
  }

  def self.mayoral_candidates
    where(committee_id: MAYORAL_CANDIDATE_IDS)
  end

  def short_name
    CANDIDATE_INFO.fetch(committee_id, {})[:name] || name
  end

  def profession
    CANDIDATE_INFO.fetch(committee_id, {})[:profession]
  end

  def party_affiliation
    CANDIDATE_INFO.fetch(committee_id, {})[:party]
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

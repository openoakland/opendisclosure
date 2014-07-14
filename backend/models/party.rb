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

  # These are the Filer_IDs of the candidates
  MAYORAL_CANDIDATE_IDS = [
    PARKER = 1357609,
    QUAN = 1354678,
    SCHAAF = 1362261,
    TUMAN = 1359017,
    MCCULLOUGH = 0,   # TODO: Fill in with Filer_ID when he has one
    RUBY = 1284364,   # TODO: This is wrong, fix it!!!
  ]

  # Filer_IDs of other races this cycle
  CANDIDATE_IDS = [
    # Auditor
    ROBERTS = 0,
    # Council 2
    BLACKBURN = 0,
    COLBRUNO = 0,
    GUILLEN = 0,
    KING = 0,
    MAO = 0,
    PARK = 0,
    # Council 4
    BROADHURST = 0,
    WASHINGTON = 0,
    HEIDORN = 0,
    LIM = 0,
    SINCLAIR = 0,
    # Council 6
    JOHNSON = 0,
    MOORE = 0,
    NOSAKHARE = 0,
  ]

  CANDIDATE_INFO = {
    PARKER => {
      name: 'Bryan Parker',
      profession: 'Health Care and Tecnology Professional',
      party: 'Democrat',
      twitter:'@bryanparker2014'
    },
    QUAN => {
      name: 'Jean Quan',
      profession: 'Incumbant Oakland Mayor',
      party: 'Democrat',
      twitter:'@jeanquan'
    },
    SCHAAF => {
      name: 'Libby Schaaf',
      profession: 'Councilmember for District 4',
      party: 'Democrat',
      twitter: '@libbyformayor'
    },
    TUMAN => {
      name: 'Joe Tuman',
      profession: 'University Professor',
      party: 'Independent',
      twitter:'@joe4mayor'

    },
    MCCULLOUGH => {
      name: 'Patrick McCullough',
      profession: '<current profession>',
      party: 'Unknown',
      twitter:''
    },
    RUBY => {
      name: 'Courtney Ruby',
      profession: 'City Auditor',
      party: 'Unknown',
      twitter:'@Ruby4Oakland'
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

  def twitter
    CANDIDATE_INFO.fetch(committee_id, {})[:twitter]
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

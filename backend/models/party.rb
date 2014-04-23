class Party < ActiveRecord::Base
  has_many :received_contributions,
    foreign_key: :recipient_id,
    class_name: 'Contribution'
  has_many :contributions,
    foreign_key: :contributor_id,
    class_name: 'Contribution'
  has_many :summaries, primary_key: :committee_id

  MAYORAL_CANDIDATE_IDS = [
    PARKER = 1357609,
    QUAN = 1354678,
    SCHAAF = 1362261,
    TUMAN = 1359017,
  ]

  CANDIDATE_INFO = {
    PARKER => {
      name: 'Bryan Parker',
      profession: '<current profession>',
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
      profession: '<current profession>',
      party: 'Independent'
    },
  }

  def self.mayoral_candidates
    where(committee_id: MAYORAL_CANDIDATE_IDS)
  end

  def short_name
    CANDIDATE_NAMES[committee_id]
  end

  def latest_summary
    summaries.order(date: :desc).first
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
end

class Party::Individual < Party
end

class Party::Other < Party
end

class Party::Committee < Party
end

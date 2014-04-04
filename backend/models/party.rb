class Party < ActiveRecord::Base
  has_many :received_contributions,
    foreign_key: :recipient_id,
    class_name: 'Contribution'
  has_many :contributions,
    foreign_key: :contributor_id,
    class_name: 'Contribution'
  has_many :summaries, primary_key: :committee_id

  CANDIDATE_NAMES = {
    1357609 => 'Bryan Parker',
    1354678 => 'Jean Quan',
    1362261 => 'Libby Schaaf',
    1359017 => 'Joe Tuman',
  }

  def self.mayoral_candidates
    where(committee_id: CANDIDATE_NAMES.keys)
  end

  def latest_summary
    summaries.order(date: :desc).first
  end
end

class Party::Individual < Party
end

class Party::Other < Party
end

class Party::Committee < Party
end

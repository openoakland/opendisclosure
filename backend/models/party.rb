class Party < ActiveRecord::Base
  def self.mayoral_candidates
    {
      find_by(committee_id: 1357609) => 'Bryan Parker',
      find_by(committee_id: 1354678) => 'Jean Quan',
      find_by(committee_id: 1362261) => 'Libby Schaaf',
      find_by(committee_id: 1359017) => 'Joe Tuman',
    }
  end
end

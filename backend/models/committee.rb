class Committee < ActiveRecord::Base
  scope :mayoral_candidates, -> { where(committee_id: [1354678, 1357609, 1362261, 1359017]) }
end

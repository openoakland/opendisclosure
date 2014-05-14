class Contribution < ActiveRecord::Base
  belongs_to :contributor, class_name: 'Party', counter_cache: :contributions_count
  belongs_to :recipient, class_name: 'Party', counter_cache: :received_contributions_count

  after_create :increment_oakland_contribution_count

  def increment_oakland_contribution_count
    if contributor.from_oakland?
      Party.increment_counter(:received_contributions_from_oakland, recipient.id)
    end
  end
end

class Contribution < ActiveRecord::Base
  self.inheritance_column = :_disabled

  belongs_to :contributor, class_name: 'Party', counter_cache: :contributions_count
  belongs_to :recipient, class_name: 'Party', counter_cache: :received_contributions_count

  after_create :increment_oakland_contribution_count
  after_create :increment_small_donor_ammount

  enum type: [:contribution, :loan, :inkind]

  def increment_oakland_contribution_count
    if contributor.from_oakland?
      Party.increment_counter(:received_contributions_from_oakland, recipient.id)
    end
  end

  def increment_small_donor_ammount
    if amount.to_f < 100 && amount.to_f > -100
      recipient.small_donations += amount.to_f
      recipient.save
    end
  end
end

class Contribution < ActiveRecord::Base
  self.inheritance_column = :_disabled

  belongs_to :contributor, class_name: 'Party', counter_cache: :contributions_count
  belongs_to :recipient, class_name: 'Party', counter_cache: :received_contributions_count

  after_create :increment_oakland_contribution_count
  after_create :increment_small_contribution_ammount
  after_create :increment_self_contributions_total

  enum type: [:contribution, :loan, :inkind]

  def increment_oakland_contribution_count
    if contributor.from_oakland?
      Party.increment_counter(:received_contributions_from_oakland, recipient.id)
    end
  end

  def increment_self_contributions_total
    # This is a bit tricky because the name of the person doesn't match the name
    # of the campaign, so there will be two Party instances with different IDs.
    # So I suppose we're stuck just string-comparing the names.
    if contributor.name == recipient.short_name
      recipient.self_contributions_total += amount
      recipient.save
    end
  end

  def increment_small_contribution_ammount
    if amount.to_f < 100 && amount.to_f > -100
      recipient.small_contributions += amount.to_f
      recipient.save
    end
  end
end

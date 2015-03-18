class IEC < ActiveRecord::Base
  self.inheritance_column = :_disabled

  belongs_to :contributor, class_name: 'Party', counter_cache: :contributions_count
  belongs_to :recipient, class_name: 'Party', counter_cache: :received_contributions_count
end

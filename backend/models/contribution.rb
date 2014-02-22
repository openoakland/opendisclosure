class Contribution < ActiveRecord::Base
  belongs_to :contributor, polymorphic: true
  belongs_to :recipient, polymorphic: true
end

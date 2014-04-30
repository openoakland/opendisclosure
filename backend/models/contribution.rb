class Contribution < ActiveRecord::Base
  belongs_to :contributor, class_name: 'Party'
  belongs_to :recipient, class_name: 'Party'
end

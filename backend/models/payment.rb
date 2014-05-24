class Payment < ActiveRecord::Base
  belongs_to :payer, class_name: 'Party'
  belongs_to :recipient, class_name: 'Party'
end

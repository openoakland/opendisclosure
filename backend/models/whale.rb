class Whale < ActiveRecord::Base
  belongs_to :contributor, class_name: 'Party'
end

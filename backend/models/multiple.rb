class Multiple < ActiveRecord::Base
  belongs_to :contributor, class_name: 'Party'
end

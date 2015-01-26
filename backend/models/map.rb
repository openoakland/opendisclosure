require 'csv'

class Map < ActiveRecord::Base
  self.inheritance_column = 'something_that_isnt_the_word_type'

  def self.load_mappings(csv)
    transaction do
      CSV.parse(open(csv).read, headers: :first_row) do |row|
        Map.create(
          id: row['id'],
          emp1: row['emp1'],
          emp2: row['emp2'],
          type: row['type'],
        )
      end
    end
  end
end

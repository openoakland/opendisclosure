require 'csv'

class Lobbyist < ActiveRecord::Base

  def self.load_from_file(csv)
    CSV.parse(open(csv).read, headers: :first_row) do |row|
      Lobbyist.create(
        id: row['Lobbyist ID'],
        name: row['Lobbyist'],
        firm: row['Lobbyist_Firm'],
      )
    end
  end
end

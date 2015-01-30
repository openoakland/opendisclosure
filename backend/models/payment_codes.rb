require 'csv'

class PaymentCodes < ActiveRecord::Base

  def self.load_from_file(csv)
    CSV.parse(open(csv).read) do |row|
      PaymentCodes.create(
        code: row[0],
        text: row[1]
      )
    end
  end
end

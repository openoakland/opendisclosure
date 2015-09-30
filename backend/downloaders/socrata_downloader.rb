# Utility class to interact with Socrata and download the rows from a
# spreadsheet.
#
# Usage:
# url = 'http://data.oaklandnet.com/resource/3xq4-ermg.json'
# SocrataDownloader.new(url).each do |record|
#   puts record       # { "key" => "value" }
# end
#
require 'open-uri'

class SocrataDownloader
  include Enumerable

  def initialize(uri)
    @uri = URI(uri)
  end

  def each(&block)
    more = true
    offset = 0
    while more
      url = @uri
      url.query = URI.encode_www_form(
        '$limit' => 1000,
        '$order' => 'thru_date ASC',
        '$offset' => offset
      )

      puts '    Downloading: ' + url.to_s

      response = JSON.parse(open(url.to_s).read)

      response.each do |row|
        next if row['rpt_date'] > '2014-11-30T00:00:00'
        block.call(row)
      end

      # preparation for next loop!
      more = response.length > 0
      offset = offset + 1000
    end
  end
end

# Utility class to interact with Socrata and download the rows from a
# spreadsheet.
#
# Usage:
# url = 'http://data.oaklandnet.com/resource/3xq4-ermg.json'
# SocrataFetcher.new(url).each do |record|
#   puts record       # { "key" => "value" }
# end
#
require 'open-uri'

class SocrataFetcher
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
        '$offset' => offset
      )

      puts '    Downloading: ' + url.to_s

      response = JSON.parse(open(url.to_s).read)
      response.each(&block)

      # preparation for next loop!
      more = response.length > 0
      offset = offset + 1000
    end
  end
end

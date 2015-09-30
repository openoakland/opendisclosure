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
    @report_num_by_filer_id = {}
  end

  def each(&block)
    more = true
    offset = 0
    while more
      url = @uri
      url.query = URI.encode_www_form(
        '$limit' => 1000,
        '$order' => 'report_num DESC',
        '$offset' => offset
      )

      puts '    Downloading: ' + url.to_s

      response = JSON.parse(open(url.to_s).read)

      # We cache the largest filer_id for each form, since that field is
      # incremented if an amended version of that form is published, and we
      # only care about the most recent version.
      response.each do |row|
        @report_num_by_filer_id[row['filer_id']] ||= row['report_num'].to_i

        if row['report_num'].to_i < @report_num_by_filer_id[row['filer_id']]
          next
        end

        block.call(row)
      end

      # preparation for next loop!
      more = response.length > 0
      offset = offset + 1000
    end
  end
end

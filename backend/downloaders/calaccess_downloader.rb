################################################################################
# THIS DOES NOT WORK
################################################################################
#
# I'm checking it in as a starting point... the problem is that Ruby Zip library
# can't stream input so I'll probably have to go back-to-the-drawing-board and
# figure out a better ETL process for this.
#
require 'net/http'
# require 'zip'

class CalaccessDownloader
  ARCHIVE_URL = URI('http://campaignfinance.cdn.sos.ca.gov/dbwebexport.zip')

  def initialize
    @conn = Net::HTTP.start(ARCHIVE_URL.host, ARCHIVE_URL.port)

    IO.pipe do |read_io, write_io|
      Thread.new do
        @conn.request Net::HTTP::Get.new(ARCHIVE_URL.request_uri) do |request|
          request.read_body { puts chunk.length; write_io << chunk }
        end
      end

      # Zip::File.open_buffer(read_io) do |zipfile|
      #   zipfile.each do |entry|
      #     puts entry.name
      #   end
      # end
    end
  end
end

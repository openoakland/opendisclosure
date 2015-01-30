require_relative 'environment.rb'
require_relative 'schema.rb' # wipe the database and start anew

class DataFetcher
  SOCRATA_URLS = [
    [DataFetcher::LateContribution, 'http://data.oaklandnet.com/resource/qact-u8hq.json'],
    [DataFetcher::Contribution, 'http://data.oaklandnet.com/resource/3xq4-ermg.json'],
    [DataFetcher::Payment, 'http://data.oaklandnet.com/resource/bvfu-nq99.json'],
    [DataFetcher::Loan, 'http://data.oaklandnet.com/resource/qaa7-q29f.json'],
    [DataFetcher::Summary, 'http://data.oaklandnet.com/resource/rsxe-vvuw.json'],
    [DataFetcher::IEC, 'http://data.oaklandnet.com/resource/jkj3-8yq3.json'],
    [DataFetcher::IEC, 'http://data.oaklandnet.com/resource/6ejr-39gh.json'],
  ]

  def self.load_all_data!
    if ENV['DEBUG']
      ActiveRecord::Base.logger = Logger.new(STDOUT)
    end

    puts "Loading Payment Codes"
    PaymentCodes.load_from_file('backend/payment_codes.csv')

    # This table maps spellings of employers to a common spelling.
    # It needs to be updated when a new batch of data is available
    # as there is no check on spelling on the forms.
    puts "Loading Employer Map"
    Map.load_mappings('backend/map.csv')

    puts "Loading Lobbyist data"
    Lobbyist.load_from_file('backend/2014_Lobbyist_Directory.csv')

    SOCRATA_URLS.each do |fetcher_class, socrata_url|
      puts "Fetching #{fetcher_class} from Socrata:"
      downloader = SocrataDownloader.new(socrata_url)
      fetcher = fetcher_class.new(downloader)

      fetcher.run!

      puts fetcher.status
    end

    puts "Run analysis"
    DataFetcher::CategoryContributions.run!
    DataFetcher::EmployerContributions.run!
    DataFetcher::CategoryPayments.run!
    DataFetcher::Multiples.run!
    DataFetcher::Whales.run!

    Import.create(import_time: Time.now)
  end
end

if __FILE__ == $0
  DataFetcher.load_all_data!
end

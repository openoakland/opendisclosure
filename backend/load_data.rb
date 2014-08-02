require_relative 'environment.rb'
require_relative 'socrata_fetcher.rb'
require_relative 'schema.rb' # wipe the database and start anew

class DataFetcher
  URLS = {
    'Schedule A' => 'http://data.oaklandnet.com/resource/3xq4-ermg.json',
    'Schedule E' => 'http://data.oaklandnet.com/resource/bvfu-nq99.json',
    'Summary'    => 'http://data.oaklandnet.com/resource/rsxe-vvuw.json',
  }.freeze

  def self.load_all_data!
    if ENV['LOG'] == "true"
      ActiveRecord::Base.logger = Logger.new(STDOUT)
    end

    # This table maps spellings of employers to a common spelling.
    # It needs to be updated when a new batch of data is available
    # as there is no check on spelling on the forms.
    puts "Loading Employer Map"
    Map.load_mappings('backend/map.csv')

    # !! Need a new Lobbyist Directory for 2014
    puts "Loading Lobbyist data"
    Lobbyist.load_from_file('backend/2013_Lobbyist_Directory.csv')

    puts "Fetching Contribution data (Schedule A) from Socrata:"
    DataFetcher::Contribution.fetch_and_parse(URLS['Schedule A'])

    puts "Fetching Expense data (Schedule E) from Socrata:"
    DataFetcher::Payment.fetch_and_parse(URLS['Schedule E'])

    puts "Fetching Summary data from Socrata:"
    DataFetcher::Summary.fetch_and_parse(URLS['Summary'])

    puts "Run analysis"
    DataFetcher::CategoryContributions.run!
    DataFetcher::EmployerContributions.run!
    DataFetcher::Multiples.run!
    DataFetcher::Whales.run!

    Import.create(import_time: Time.now)
  end
end

if __FILE__ == $0
  DataFetcher.load_all_data!
end

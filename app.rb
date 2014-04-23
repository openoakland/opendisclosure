require 'sinatra'
require 'sinatra/content_for'
require 'active_record'
require 'haml'
require_relative 'toms_cache'

# Load ActiveRecord models (and connect to the database)
ActiveRecord::Base.establish_connection
Dir['./backend/models/*.rb'].each { |f| require f }

configure do
  set :public_folder, 'assets'
  set :cache, TomsCache.new
end

# The homepage
get '/' do

  # This renders the file views/index.haml inside of the 'yield' in
  # views/layout.haml:
  haml :index, locals: {
    organizations: Party.mayoral_candidates
  }
end

# TODO: Rename to /candidate/:slug ?
#
# This is the candidate page, i.e. the page which summarizes each candidate's
# overall financial status.
get '/party/:id' do |id|
  party         = Party.find(id)
  contributions = Contribution
                    .where(recipient_id: party)
                    .includes(:contributor)

  # This renders the file views/party.haml inside of the 'yield' in
  # views/layout.haml:
  haml :party, locals: {
    party: party,
    contributions: contributions,
    summary: party.latest_summary,
  }
end

# This is page of contributions from an individual/company to various campaigns.
get '/party/:id/contributions' do |id|
  party         = Party.find(id)
  contributions = Contribution
                    .where(contributor_id: party)
                    .includes(:recipient)

  # This renders the file views/contributor.haml inside of the 'yield' in
  # views/layout.haml:
  haml :contributor, locals: {
    party: party,
    contributions: contributions,
  }
end

# Below here are some API endpoints for the frontend JS to use to fetch data.
# This uses a special ActiveRecord syntax for converting models to JSON. It is
# documented here:
#   http://apidock.com/rails/ActiveRecord/Serialization/to_json
get '/api/candidates' do
  fields = {
    only: %w[id name committee_id],
    methods: [
      :latest_summary,
      :short_name,
      :profession,
      :party_affiliation,
    ],
  }

  Party.mayoral_candidates.to_json(fields)
end

get '/api/contributions' do
  fields = {
    only: %w[amount date],
    include: [:recipient, :contributor],
  }

  Contribution
    .where(recipient_id: Party.mayoral_candidates.pluck(:id))
    .includes(:recipient, :contributor)
    .to_json(fields)
end

get '/api/party/:id' do |id|
  # TODO: Include names of the people contributing?
  fields = {
    only: %w[id name committee_id],
    include: {
      received_contributions: { },
      contributions: { }
    }
  }

  Party.find(id).to_json(fields)
end

# Deprecated in favor of the JSON API!
get '/data/data.csv' do
  unless ENV['RACK_ENV'] == 'production'
    redirect '/data/data_local.csv', 302
  else
    # Pull the data from Socrata and cache it for a day.
    # TODO: Send Last-Modified and return a 304 so browsers can cache this file.
    headers['Content-Encoding'] = 'gzip'
    settings.cache.fetch do
      require 'open-uri'
      require 'zlib'

      StringIO.new.tap do |s|
        w = Zlib::GzipWriter.new(s)
        begin
          more = true
          written_headers = false
          offset = 0
          while more
            url = URI('https://data.oaklandnet.com/resource/3xq4-ermg.csv')
            url.query = URI.encode_www_form(
              '$where' => Party.mayoral_candidates
                               .map { |c| "filer_naml='#{c.name}'" }
                               .join(' OR '),
              '$limit' => 1000,
              '$offset' => offset
            )

            headers, *response = open(url).read.split("\n")
            w.puts headers unless written_headers
            w.write response.join("\n")

            # preparation for next loop!
            more = response.length > 0
            written_headers = true
            offset = offset + 1000
          end
        ensure
          w.close
        end
      end.string
    end
  end
end

after do
  ActiveRecord::Base.connection.close
end

require 'sinatra'
require 'sinatra/content_for'
require 'active_record'
require 'haml'
require_relative 'toms_cache'

ActiveRecord::Base.establish_connection

# Load ActiveRecord models so we can query using an ORM
Dir['./backend/models/*.rb'].each { |f| require f }

configure do
  set :public_folder, 'assets'
  set :cache, TomsCache.new
end

get '/' do
  haml :index, locals: {
    organizations: Party.mayoral_candidates
  }
end

# TODO: Rename to /candidate/:slug ?
get '/party/:id' do |id|
  party         = Party.find(id)
  contributions = Contribution
                    .where(recipient_id: party)
                    .includes(:contributor)

  haml :party, locals: {
    party: party,
    contributions: contributions,
    summary: party.summaries.order(date: :desc).first,
  }
end

get '/party/:id/contributions' do |id|
  party         = Party.find(id)
  contributions = Contribution
                    .where(contributor_id: party)
                    .includes(:recipient)

  haml :contributor, locals: {
    party: party,
    contributions: contributions,
  }
end

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
              '$where' => Committee.mayoral_candidates.keys
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

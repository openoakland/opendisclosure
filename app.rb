require 'sinatra'
require 'active_record'
require 'haml'

# NOTE: Vivian added arguments here to make the dev server work.
ActiveRecord::Base.establish_connection
# Added parameters to run locally
# (
#   :adapter => "sqlite3",
#   :database  => "backend/db.sqlite3"
# )

# Load ActiveRecord models so we can query using an ORM
Dir['./backend/models/*.rb'].each { |f| require f }

configure do
  set :public_folder, 'assets'
end

get '/' do
  haml :index, locals: {
    organizations: Committee.mayoral_candidates
  }
end

get '/recipients/:type/:id' do |type, id|
  recipient     = get_record_by_type(type, id)
  contributions = Contribution
                    .where(recipient_id: recipient)
                    .includes(:contributor)

  haml :recipient, locals: {
    recipient: recipient,
    contributions: contributions
  }
end

get '/contributions' do
  contributors = case params[:type]
  when 'individuals'
    Individual
  when 'committees'
    Committee
  when 'others'
    OtherContributor
  end.order(:name)

  haml :contributions, locals: {
    contributors: contributors
  }
end

get '/contributors/:type/:id' do |type, id|
  contributor = get_record_by_type(type, id)
  contributions = Contribution
                    .where(contributor_id: contributor)
                    .includes(:recipient)

  haml :contributor, locals: {
    contributor: contributor,
    contributions: contributions,
  }
end

def get_record_by_type(type, id)
  case type
  when 'individual'
    Individual
  when 'committee'
    Committee
  when 'othercontributor'
    OtherContributor
  end.find(id)
end

after do
  ActiveRecord::Base.connection.close
end

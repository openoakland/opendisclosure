require 'sinatra'
require 'active_record'
require 'haml'

ActiveRecord::Base.establish_connection

# Load ActiveRecord models so we can query using an ORM
Dir['./backend/models/*.rb'].each { |f| require f }

get '/' do
  haml :index, locals: {
    organizations: Committee.mayoral_candidates
  }
end

get '/committees/:id' do |id|
  committee     = Committee.find_by(committee_id: id)
  contributions = Contribution
                    .where(recipient_id: committee)
                    .includes(:contributor)

  haml :contributions, locals: {
    committee: committee,
    contributions: contributions
  }
end

get '/individuals' do
  haml :contributors, locals: {
    contributors: Individual.order(:name).pluck(:name)
  }
end

get '/others' do
  haml :contributors, locals: {
    contributors: OtherContributor.order(:name).pluck(:name)
  }
end

after do
  ActiveRecord::Base.connection.close
end

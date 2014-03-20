require 'sinatra'
require 'sinatra/content_for'
require 'active_record'
require 'haml'
require 'json'

ActiveRecord::Base.establish_connection

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

get '/rawtables' do
  alltabs = Hash.new()
  alltabs['Committee'] = Committee.all.to_a.map {|r| r.attributes}
  alltabs['Contribution'] = Contribution.all.to_a.map {|r| r.attributes}
  alltabs['Individual'] = Individual.all.to_a.map {|r| r.attributes}
  alltabs['OtherContributor'] = OtherContributor.all.to_a.map {|r| r.attributes}
  alltabs['_MayoralCandidates'] = [
    {'committee_id' => 1357609, 'candidate_name' => 'Bryan Parker'},
    {'committee_id' => 1354678, 'candidate_name' => 'Jean Quan'},
    {'committee_id' => 1362261, 'candidate_name' => 'Libby Schaaf'},
    {'committee_id' => 1359017, 'candidate_name' => 'Joe Tuman'}
  ]
  JSON.generate(alltabs)
end

get '/alltables' do
  #  Collect all contribution parties by type
  parties = Hash.new()
  parties['Individual'] = Hash.new()
  parties['Committee'] = Hash.new()
  parties['OtherContributor'] = Hash.new()
  committees = Committee.all.to_a.map {|r| r.attributes}
  committees.each {|c| parties['Committee'][c['id']] = c}
  individuals = Individual.all.to_a.map {|r| r.attributes}
  individuals.each {|i| parties['Individual'][i['id']] = i}
  others = OtherContributor.all.to_a.map {|r| r.attributes}
  others.each {|o| parties['OtherContributor'][o['id']] = o}

  # gather contributions and add parties as members
  contribs = Contribution.all.to_a.map do |r|
    x = r.attributes
    x['_contributor'] = parties[x['contributor_type']][x['contributor_id']]
    x['_recipient'] = parties[x['recipient_type']][x['recipient_id']]
    x
  end

  alltabs = Hash.new()
  mayorals = [
    {'committee_id' => 1357609, 'candidate_name' => 'Bryan Parker'},
    {'committee_id' => 1354678, 'candidate_name' => 'Jean Quan'},
    {'committee_id' => 1362261, 'candidate_name' => 'Libby Schaaf'},
    {'committee_id' => 1359017, 'candidate_name' => 'Joe Tuman'}
  ]
  alltabs['_MayoralCandidates'] = mayorals.map do |m|
    matchcom = committees.select do |c|
      c['committee_id'] == m['committee_id']
    end
    m['candidate_committee'] = matchcom[0]
    m
  end
  alltabs['contrib'] = contribs
  JSON.generate(alltabs)
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

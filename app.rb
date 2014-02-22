require 'sinatra'
require 'active_record'

# Load ActiveRecord models so we can query using an ORM
Dir['./backend/models/*.rb'].each { |f| require f }

get '/' do
  return "<a href='/individuals'>Individual Contributors</a>" +
         "<a href='/others'>Other Contributors</a>"
end

get '/individuals' do
  return '<ul>' + Individual.pluck(:name).join('</li><li>') + '</ul>'
end

get '/others' do
  return '<ul>' + OtherContributor.pluck(:name).join('</li><li>') + '</ul>'
end

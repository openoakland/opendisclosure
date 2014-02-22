require 'sinatra'
require 'active_record'

ActiveRecord::Base.establish_connection(
  database: './backend/db.sqlite3',
  adapter: 'sqlite3'
)

get '/' do
  return 'hello'
end

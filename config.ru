$LOAD_PATH << '.'
ENV['DATABASE_URL'] ||= 'sqlite3://./backend/db.sqlite3'

require 'app'
run Sinatra::Application

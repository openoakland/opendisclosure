$LOAD_PATH << '.'
ENV['DATABASE_URL'] ||= 'postgres://localhost/postgres'

require 'app'
run Sinatra::Application

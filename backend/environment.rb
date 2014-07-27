$LOAD_PATH << '.'

require 'active_record'
require 'dotenv'

Dotenv.load

ActiveRecord::Base.establish_connection ENV['DATABASE_URL']

Dir[File.dirname(__FILE__) + '/models/*.rb'].each { |f| require f }

$LOAD_PATH << '.'

require 'active_record'
require 'dotenv'
require 'pg'

Dotenv.load

ENV['DATABASE_URL'] ||= "postgres://localhost/postgres"

pg_stopped = `ps | grep postgres | grep -v grep`.empty?
pg_stopped_message = <<-INFO
PostgreSQL appears to not be running... If you installed it with homebrew you
can start it with:

postgres -D /usr/local/var/postgres
INFO

begin
  ActiveRecord::Base.establish_connection ENV['DATABASE_URL']
  ActiveRecord::Base.connection.verify!
rescue PG::ConnectionBad => ex
  raise ex unless pg_stopped
  puts pg_stopped_message

  exit 1
rescue ActiveRecord::AdapterNotSpecified
  url = "postgres://#{ENV['USER']}:[your password]@localhost/postgres"
  default_url = "postgres://#{ENV['USER']}@localhost/postgres"

  begin
    conn = ActiveRecord::Base.establish_connection default_url
    conn.connection
    url = default_url
  rescue PG::ConnectionBad => ex
    raise ex unless pg_stopped
    puts pg_stopped_message

    exit 1
  end

  puts "You need to run this command:"
  puts "echo DATABASE_URL=\"#{url}\" > .env"

  exit 1
end

require 'backend/candidate_config'
Dir[File.dirname(__FILE__) + '/models/*.rb'].each { |f| require f }
Dir[File.dirname(__FILE__) + '/fetchers/*.rb'].each { |f| require f }
Dir[File.dirname(__FILE__) + '/downloaders/*.rb'].each { |f| require f }

require_relative '../app.rb'
require 'rack/test'

RSpec.configure do |c|
  c.include Rack::Test::Methods
end

describe OpenDisclosureApp do
  let(:app) { described_class }

  describe '/' do
    subject { get '/' }

    # Just add a smoke test for now. Later, we can add some more meat to this
    # test suite.
    it { should be_ok }
  end

  describe '/api/candidates' do
    subject { get '/api/candidates' }
  end
end

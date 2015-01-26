require_relative '../app.rb'

describe OpenDisclosureApp do
  let(:app) { described_class }

  describe '/' do
    subject { get '/' }

    # Just add a smoke test for now. Later, we can add some more meat to this
    # test suite.
    it { should be_ok }
  end

  describe '/api/contributor/:id' do
    let(:contribution) { create(:contribution) }

    def response; JSON.parse(subject.body); end

    subject { get "/api/contributor/#{contribution.contributor_id}" }

    it 'returns the contributions by that party' do
      expect(response.length).to eq(1)
    end

    context 'with another contribution to a different Party' do
      let!(:other_contribution) { create(:contribution) }

      it 'does not return contributions by the other party' do
        expect(response.map { |c| c["id"] }).not_to include(other_contribution.id)
      end
    end
  end
end

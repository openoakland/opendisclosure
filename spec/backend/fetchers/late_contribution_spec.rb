describe DataFetcher::LateContribution do
  describe '.parse_row' do
    subject { described_class.new([row]).run! }

    context 'with a valid person-to-committee contribution' do
      let(:row) { JSON.load(File.read('spec/samples/socrata_late_contribution_from_committee.json')) }

      it 'parses' do
        expect { subject }.to change { Contribution.count }.by(1)
      end
    end
  end
end

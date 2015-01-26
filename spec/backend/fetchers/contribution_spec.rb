describe DataFetcher::Contribution do
  before do
    ::Contribution.delete_all
    ::Party.delete_all
  end

  describe '.parse_row' do
    subject { described_class.new([row]).run! }

    context 'with a valid committe-to-committee contribution' do
      let(:row) { JSON.load(File.read('spec/samples/socrata_contribution_from_committee.json')) }

      it 'creates a Contribution record' do
        expect { subject }.to change { Contribution.count }.by(1)
      end
    end

    context 'when given a valid personal contribution from Socrata' do
      let(:row) { JSON.load(File.read('spec/samples/socrata_contribution_valid.json')) }

      it 'creates a party for the recipient' do
        subject
        expect(Party.where(committee_id: row['filer_id'])).to be_present
      end

      it 'creates a Contribution record with the right values' do
        subject
        expect(Contribution.first.amount).to equal(row['tran_amt1'].to_i)
        expect(Contribution.first.contributor).to be_present
      end

      context 'when the recipient exists already' do
        it "doesn't create a Party for the recipient" do
          ::Party::Committee.create(name: 'foo', committee_id: row['filer_id'])

          expect { subject }.not_to change { Party.where(committee_id: row['filer_id']).count }
        end
      end
    end
  end
end

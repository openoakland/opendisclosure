describe DataFetcher::Contribution do
  before do
    ::Contribution.delete_all
    ::Party.delete_all
  end

  let(:row) do
    FactoryGirl.build(:contribution, :from_json)
  end

  describe '.parse_contributions' do
    subject { described_class.parse_contributions(row) }

    context 'when given a valid row' do
      it 'creates a party for the recipient' do
        subject
        expect(Party.where(committee_id: row['filer_id'])).to be_present
      end

      it 'creates a Contribution record with the right values' do
        subject
        expect(Contribution.first.amount).to equal(row['tran_amt1'].to_i)
      end

      context 'when the recipient exists already' do
        it "doesn't create a Party for the recipient" do
          FactoryGirl.create(:committee, committee_id: row['filer_id'])

          expect { subject }.
            not_to change { Party.where(committee_id: row['filer_id']).count }
        end
      end
    end
  end
end

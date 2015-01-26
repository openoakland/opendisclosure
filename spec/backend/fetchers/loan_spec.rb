describe DataFetcher::Loan do
  subject { described_class.new([row]).run! }

  context 'with a normal row' do
    let(:row) { JSON.load(File.read('spec/samples/socrata_loan.json')) }

    it 'creates a Loan record' do
      expect { subject }.to change { ::Contribution.count }.by(1)
    end
  end
end

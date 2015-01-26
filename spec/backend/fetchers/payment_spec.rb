describe DataFetcher::Payment do
  subject { described_class.new([row]).run! }

  describe 'with a valid payment row' do
    let(:row) { JSON.load(File.read('spec/samples/socrata_payment.json')) }

    it 'loads a payment' do
      expect { subject }.to change { ::Payment.count }.by(1)
    end
  end
end

describe DataFetcher::IEC do
  subject { DataFetcher::IEC.new([row]) }

  context 'with a valid row' do
    let(:row) { JSON.load(File.read('spec/samples/socrata_iec.json')) }

    it 'does nothing without a recipient already' do
      expect { subject.run! }.to change { ::Contribution.count }.by(0)
    end

    context 'when a recipient is found' do
      before do
        allow(subject).to receive(:get_recipient).and_return(Party::Committee.create!(name: 'testing'))
      end

      it 'creates a contribution' do
        expect { subject.run! }.to change { ::Contribution.count }.by(1)
      end
    end
  end
end

require 'date'

describe DataFetcher::Summary do
  before do
    ::Summary.delete_all
  end

  describe '.parse_row' do
    subject { DataFetcher::Summary.new(rows).tap(&:run!).last_result }

    context 'when the line item is "total monetary contributions"' do
      let(:row) { JSON.load(File.read('spec/samples/socrata_summary.json')) }
      let(:rows) { [row] }
      let(:thru_date) { Date.parse('2013-06-30') }
      let(:amount) { (Random.rand * 100).to_i }

      before do
        row['form_type'] = 'F460'
        row['line_item'] = '3'
        row['amount_a'] = amount
        row['thru_date'] = thru_date
      end

      it 'sets amount correctly' do
        expect(subject.total_monetary_contributions).to eq(amount)
      end

      context 'when there are multiple summaries' do
        before do
          other_row = row.dup
          other_row['amount_a'] = other_amount
          other_row['thru_date'] = other_thru_date

          rows << other_row

          subject
        end

        let(:other_amount) { (Random.rand * 100).to_i }
        let(:other_thru_date) { thru_date + 1 }

        it 'aggregates across multiple rows' do
          expect(subject.reload.total_monetary_contributions).
            to eq(amount + other_amount)
        end
      end
    end
  end
end

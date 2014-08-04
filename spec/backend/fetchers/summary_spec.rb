require 'date'

describe DataFetcher::Summary do
  before do
    ::Summary.delete_all
  end

  describe '.parse_summary' do
    let(:row) { FactoryGirl.build(:summary, :from_json) }

    subject { DataFetcher::Summary.parse_summary(row) }

    context 'when the line item is "total monetary contributions"' do
      before do
        row['form_type'] = 'F460'
        row['line_item'] = '1'
        row['amount_a'] = amount
        row['thru_date'] = thru_date
      end

      let(:thru_date) { Date.parse('2013-06-30') }
      let(:amount) { (Random.rand * 100).to_i }

      it 'sets amount correctly' do
        expect(subject.total_monetary_contributions).to eq(amount)
      end

      it 'sets the last_summary_date accordingly' do
        expect(subject.last_summary_date).to eq(thru_date)
      end

      context 'when there are multiple summaries' do
        before do
          other_row = row.dup
          other_row['amount_a'] = other_amount
          other_row['thru_date'] = other_thru_date

          subject
          DataFetcher::Summary.parse_summary(other_row)
        end

        let(:other_amount) { (Random.rand * 100).to_i }
        let(:other_thru_date) { thru_date + 1 }

        it 'aggregates across multiple rows' do
          expect(subject.reload.total_monetary_contributions).
            to eq(amount + other_amount)
        end

        it 'updates the last_summary_date' do
          expect(subject.reload.last_summary_date).
            to eq(other_thru_date)
        end
      end
    end
  end
end

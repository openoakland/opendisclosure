require 'date'

describe DataFetcher::Summary do
  before do
    ::Summary.delete_all
  end

  describe '.parse_summary' do
    let(:row) do
      {
        "thru_date" : "2011-12-31T00:00:00",
        "line_item" : "1",
        "from_date" : "2011-07-01T00:00:00",
        "filer_naml" : "Harland For Mayor",
        "amount_a" : "0",
        "report_num" : "0",
        "amount_b" : "5762",
        "form_type" : "F460",
        "rec_type" : "SMRY",
        "filer_id" : "1327636",
        "committee_type" : "CTL",
        "rpt_date" : "2014-04-01T00:00:00"
      }
    end

    subject { DataFetcher::Summary.parse_summary(row) }

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

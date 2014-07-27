class DataFetcher
  class Summary
    # Hash of:
    # Form_Type => { Line_Item => SQL Column name }
    SUMMARY_LINES = {
      'F460' => {
        '1'  => :total_monetary_contributions,
        '5'  => :total_contributions_received,
        '11' => :total_expenditures_made,
        '16' => :ending_cash_balance,
      },
      'A' => {
        '2' => :total_unitemized_contributions,
      },
    }.freeze

    def self.parse_summary(row)
      return unless SUMMARY_LINES.include? row['form_type']
      return unless SUMMARY_LINES[row['form_type']].include? row['line_item']
      return if row['filer_id'] == 'Pending' || row['filer_id'].to_i == 0

      column = SUMMARY_LINES[row['form_type']][row['line_item']]
      value = row['amount_a']
      summary = ::Summary.where(party_id: row['filer_id'])
                         .first_or_create

      # HACK / Naming convention:
      # The "Total" fields (i.e. :total_monetary_contributions) are reported
      # on each summary sheet for that period only. This means to calculate a true
      # total, we need to add the values from each of the summary sheets.
      if column =~ /^total/
        summary.update_attributes(
          column => (summary[column] || 0) + value.to_i,
          :last_summary_date => row['thru_date']
        )
      else
        summary.update_attributes(
          column => value,
          :last_summary_date => row['thru_date']
        )
      end
    end
  end
end

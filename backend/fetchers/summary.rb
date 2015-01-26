require 'backend/fetchers/base'

class DataFetcher::Summary < DataFetcher::Base
  # Hash of:
  # Form_Type => { Line_Item => SQL Column name }
  SUMMARY_LINES = {
    'F460' => {
      '3'  => :total_monetary_contributions,
      '4'  => :total_nonmonetary_contributions,
      '5'  => :total_contributions_received,
      '9'  => :total_unpaid_bills,
      '11' => :total_expenditures_made,
      '14' => :total_misc_increases_to_cash,
      '16' => :ending_cash_balance,
    },
    'A' => {
      '2' => :total_unitemized_contributions,
    },
  }.freeze

  def validate_row(row)
    return 'Unused Form Type' unless SUMMARY_LINES.include? row['form_type']
    return 'Unused Line Item' unless SUMMARY_LINES[row['form_type']].include? row['line_item']
    return 'Pending filer_id' if row['filer_id'] == 'Pending' || row['filer_id'].to_i == 0
  end

  def parse_row(row)
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
      )
    else
      summary.update_attributes(
        column => value,
      )
    end

    ::Party.where(committee_id: row['filer_id'])
      .update_all(['last_updated_date = GREATEST(?, last_updated_date)', row['rpt_date']])

    summary
  end
end

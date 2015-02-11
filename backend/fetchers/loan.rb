require 'backend/fetchers/base'

class DataFetcher::Loan < DataFetcher::Base
  def validate_row(row)
    return 'No loan amount' if row['loan_amt1'].to_i == 0 && row['loan_amt5'].to_i == 0 && row['loan_amt6'].to_i == 0
    return 'No loan name' if row['loan_amt1'].nil? && row['lndr_naml'].nil? && row['lndr_namf'].nil?
  end

  def parse_row(row)
    recipient = get_filer(row)

    contributor =
      case row['entity_cd']
      when 'COM', 'SCC'
        # contributor is a Committee and Cmte_ID is set. Same thing as
        # Filer_ID but some names disagree
        Party::Committee.where(committee_id: row['cmte_id'])
          .first_or_create(name: row['lndr_naml'])

      when 'IND', 'OTH'
        # If there is a first name this may have been chatacterized as other
        # instead of individual.  This happened with the Firefighters Union Pac
        if row['entity_cd'] == 'IND' || !row['tran_namf'].nil?
          # contributor is an Individual
          full_name = row.values_at('lndr_namf', 'lndr_naml', 'lndr_nams')
            .join(' ')
            .strip
          Party::Individual.where(name: full_name,
                                  city: row['loan_city'],
                                  state: row['loan_st'],
                                  zip: row['loan_zip4'])
            .first_or_create(employer: row['loan_emp'],
          occupation: row['loan_occ'])
        else
          # contributor is "Other"
          Party::Other.where(name: row['lndr_naml'])
            .first_or_create(city: row['loan_city'],
                             state: row['loan_st'],
                             zip: row['loan_zip4'])
        end
      end

    # "amount received this period less amount paid backand amount forgiven"
    loan_amt = row['loan_amt1'].to_i - (row['loan_amt5'].to_i + row['loan_amt6'].to_i)
    # There is no date recorded for the rempayment/forgiven date, so just use
    # the report date.
    if loan_amt > 0 
      loan_date = row['loan_date1']
    else
      loan_date = row['rpt_date']
    end

    ::Contribution.where(recipient: recipient, transaction_id: row['tran_id'],
                         contributor: contributor,
                         amount: loan_amt,
                         date: loan_date,
                         type: 'loan'
                        ).first_or_create
  end
end

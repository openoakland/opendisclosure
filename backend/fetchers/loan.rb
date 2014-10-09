class DataFetcher
  class Loan
    def self.fetch_and_parse(url)
      SocrataFetcher.new(url).each do |record|
        parse_loan(record)
      end
    end

    def self.parse_loan(row)
      return if row['loan_amt1'].to_i == 0

      recipient = Party::Committee.where(committee_id: row['filer_id'])
                                  .first_or_create(name: row['filer_naml'])

      contributor =
        case row['entity_cd']
        when 'COM', 'SCC'
          # contributor is a Committee and Cmte_ID is set. Same thing as
          # Filer_ID but some names disagree
          Party::Committee.where(committee_id: row['cmte_id'])
                          .first_or_create(name: row['lndr_naml'])

        when 'IND'
          # contributor is an Individual
          full_name = row.values_at('lndr_namt', 'lndr_namf', 'lndr_naml', 'lndr_nams')
                         .join(' ')
                         .strip
          Party::Individual.where(name: full_name,
                                  city: row['loan_city'],
                                  state: row['loan_st'],
                                  zip: row['loan_zip4'])
                           .first_or_create(employer: row['loan_emp'],
                                            occupation: row['loan_occ'])
        when 'OTH'
          # contributor is "Other"
          Party::Other.where(name: row['lndr_naml'])
                      .first_or_create(city: row['loan_city'],
                                       state: row['loan_st'],
                                       zip: row['loan_zip4'])
        end

      ::Contribution.where(recipient: recipient, transaction_id: row['tran_id']).first_or_create(
        contributor: contributor,
        amount: row['loan_amt1'], # "amount received this period"
        date: row['loan_date1'],
        type: 'loan',
      )
    end
  end
end

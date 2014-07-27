class DataFetcher
  class Contribution
    def self.parse_contributions(row)
      recipient = Party::Committee.where(committee_id: row['filer_id'])
                                  .first_or_create(name: row['filer_naml'])

      contributor =
        case row['entity_cd']
        when 'COM', 'SCC'
          # contributor is a Committee and Cmte_ID is set. Same thing as
          # Filer_ID but some names disagree
          Party::Committee.where(committee_id: row['cmte_id'])
                          .first_or_create(name: row['tran_naml'])

        when 'IND'
          # contributor is an Individual
          full_name = row.values_at('tran_namt', 'tran_namf', 'tran_naml', 'tran_nams')
                         .join(' ')
                         .strip
          Party::Individual.where(name: full_name,
                                  city: row['tran_city'],
                                  state: row['tran_state'],
                                  zip: row['tran_zip4'])
                           .first_or_create(employer: row['tran_emp'],
                                            occupation: row['tran_occ'])
        when 'OTH'
          # contributor is "Other"
          Party::Other.where(name: row['tran_naml'])
                      .first_or_create(city: row['tran_city'],
                                       state: row['tran_state'],
                                       zip: row['tran_zip4'])
        end

      ::Contribution.create(recipient: recipient,
                            contributor: contributor,
                            amount: row['tran_amt1'],
                            date: row['tran_date'])
    end
  end
end

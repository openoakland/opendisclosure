class DataFetcher
  class LateContribution
    def self.fetch_and_parse(url)
      SocrataFetcher.new(url).each do |record|
        parse_contributions(record)
      end
    end

    def self.parse_contributions(row)
      recipient = Party::Committee.where(committee_id: row['filer_id'])
                                  .first_or_create(name: row['filer_naml'])

      contributor =
        case row['entity_cd']
        when 'COM', 'SCC'
          # contributor is a Committee and Cmte_ID is set. Same thing as
          # Filer_ID but some names disagree
          Party::Committee.where(committee_id: row['cmte_id'])
                          .first_or_create(name: row['enty_naml'])

        when 'IND'
          # contributor is an Individual
          full_name = row.values_at('enty_namt', 'enty_namf', 'enty_naml', 'enty_nams')
                         .join(' ')
                         .strip
          Party::Individual.where(name: full_name,
                                  city: row['enty_city'],
                                  state: row['enty_st'],
                                  zip: row['enty_zip4'])
                           .first_or_initialize
                           .tap { |p| p.update_attributes(employer: row['ctrib_emp'], occupation: row['ctrib_occ']) }
        when 'OTH'
          # contributor is "Other"
          Party::Other.where(name: row['enty_naml'])
                      .first_or_initialize
                      .tap { |p| p.update_attributes(city: row['enty_city'], state: row['enty_st'], zip: row['enty_zip4']) }
        end

      ::Contribution.create(
        recipient: recipient,
        contributor: contributor,
        amount: row['amount'],
        date: row['ctrib_date'],
        type: 'contribution'
      )
    end
  end
end

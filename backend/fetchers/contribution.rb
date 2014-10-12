class DataFetcher
  class Contribution
    def self.fetch_and_parse(url)
      SocrataFetcher.new(url).each do |record|
        parse_contributions(record)
      end
    end

    def self.parse_contributions(row)
      recipient = Party::Committee.where(committee_id: 0, name: row['filer_naml']);
      if (row['filer_id'] == 0) then
	# Pending committee id.
	if (recipient.empty?) then
	  recipient = Party::Committee.create(committee_id: 0, name: row['filer_naml']);
	end
      elsif (recipient.empty?) then
	recipient = Party::Committee.where(committee_id: row['filer_id'])
				    .first_or_create(name: row['filer_naml']);
      else
	recipient = Party::Committee.where(name: row['filer_naml'])
				    .update_all(committee_id: row['filer_id']);
      end

      contributor =
        case row['entity_cd']
        when 'COM', 'SCC'
          # contributor is a Committee and Cmte_ID is set. Same thing as
          # Filer_ID but some names disagree
          Party::Committee.where(committee_id: row['cmte_id'])
                          .first_or_create(name: row['tran_naml'] || 'unknown')

        when 'IND'
          # contributor is an Individual
          full_name = row.values_at('tran_namt', 'tran_namf', 'tran_naml', 'tran_nams')
                         .join(' ')
                         .strip
          Party::Individual.where(name: full_name,
                                  city: row['tran_city'],
                                  state: row['tran_state'],
                                  zip: row['tran_zip4'])
                           .first_or_initialize
                           .tap { |p| p.update_attributes(employer: row['tran_emp'], occupation: row['tran_occ']) }
        when 'OTH'
          # contributor is "Other"
          Party::Other.where(name: row['tran_naml'] || 'unknown')
                      .first_or_initialize
                      .tap { |p| p.update_attributes(city: row['tran_city'], state: row['tran_state'], zip: row['tran_zip4']) }
        end

	::Contribution.where(recipient: recipient,
			     transaction_id: row['tran_id'],
			     contributor: contributor,
			     amount: row['tran_amt1'],
			     date: row['tran_date'],
			     type: 'contribution'
			    ).first_or_create();
    end
  end
end

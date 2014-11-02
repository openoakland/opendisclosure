class DataFetcher
  class Contribution
    def self.fetch_and_parse(url)
      SocrataFetcher.new(url).each do |record|
        parse_contributions(record)
      end
    end

    def self.parse_contributions(row)
      if (row['tran_amt1'].nil? and row['tran_naml'].nil? and row['tran_namf'].nil?) then
	puts "Skipping " + row.values_at('filer_naml', 'tran_id').join(':');
	return
      end

      recipient = DataFetcher.get_filer(row);

      contributor =
        case row['entity_cd']
        when 'COM', 'SCC'
          # contributor is a Committee and Cmte_ID is set. Same thing as
          # Filer_ID but some names disagree
          Party::Committee.where(committee_id: row['cmte_id'])
                          .first_or_create(name: row['tran_naml'] || 'unknown')

        when 'IND', 'OTH'
	  if row['entity_cd'] == 'IND' || !row['tran_namf'].nil? then
	    # contributor is an Individual
	    full_name = row.values_at('tran_namf', 'tran_naml', 'tran_nams')
			   .join(' ')
			   .strip
	    Party::Individual.where(name: full_name,
				    city: row['tran_city'],
				    state: row['tran_state'],
				    zip: row['tran_zip4'])
			     .first_or_initialize
			     .tap { |p| p.update_attributes(employer: row['tran_emp'], occupation: row['tran_occ']) }
	  else
	    # contributor is "Other"
	    Party::Other.where(name: row['tran_naml'] || 'unknown')
			.first_or_initialize
			.tap { |p| p.update_attributes(city: row['tran_city'], state: row['tran_state'], zip: row['tran_zip4']) }
	  end
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

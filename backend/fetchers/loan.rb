class DataFetcher
  class Loan
    def self.fetch_and_parse(url)
      SocrataFetcher.new(url).each do |record|
        parse_loan(record)
      end
    end

    def self.parse_loan(row)
      if (row['loan_amt1'].nil? and row['lndr_naml'].nil? and row['lndr_namf'].nil?) then
	puts "Skipping " + row.values_at('filer_naml', 'tran_id').join(':')
	return
      end
      return if row['loan_amt1'].to_i == 0 and row['loan_amt5'].to_i == 0 and row['loan_amt6'].to_i == 0

      recipient = DataFetcher.get_filer(row)

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
	  if row['entity_cd'] == 'IND' || !row['tran_namf'].nil? then
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

      ::Contribution.where(recipient: recipient, transaction_id: row['tran_id'],
			    contributor: contributor,
			    # "amount received this period less amount paid backand amount forgiven"
			    amount: row['loan_amt1'].to_i - 
			        (row['loan_amt5'].to_i + row['loan_amt6'].to_i),
			    date: row['loan_date1'],
			    type: 'loan'
			  ).first_or_create()
    end
  end
end

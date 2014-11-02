class DataFetcher
  class IEC
    def self.fetch_and_parse(url)
      SocrataFetcher.new(url).each do |record|
        parse_contributions(record)
      end
    end

    def self.parse_contributions(row)
      if ((!row['juris_dscr'].nil? && !/oakland/i.match(row['juris_dscr'])) ||
	  (!row['bal_juris'].nil? && !/oakland/i.match(row['bal_juris'])))
      then
	return
      end
      contributor = DataFetcher.get_filer(row)

      # See if this is a measure expenditure.
      expn_date = row['expn_date']
      if expn_date.nil? then
	# the 496 and 465 have differnt column names
	expn_date = row['exp_date']
      end
      if row['bal_num'].nil? then
	# The data only has candidate names. 
	# Sometimes they are only in one of the name fields.
	# Try to match first on both names with the year of the campaign as this tends to
	# be in the title of the comittee. It would be nice to use the elect_date field
	# but this does not seem to be entered so we use the exp_date.
	#
	# The Kaplan committee does not have her first name in the title
	# but an IEC does, avoid having it give money to itself.
	if row['cand_naml'] == 'Kaplan' && expn_date[0, 4] == '2014' then
	  search = 'Kaplan for Oakland Mayor 2014'
	else
	  search = "%" + (row['cand_namf'].nil? ? "" : row['cand_namf']) +
		    (row['cand_naml'].nil? ? "" : row['cand_naml']) +
		    "%" + expn_date[0, 4] + "%"
	end
	recipient = Party::Committee.where("lower(name) like lower(?)", search).first
	if recipient.nil? then
	  # Can't match with the year, try without.
	  search = "%" + (row['cand_namf'].nil? ? "" : row['cand_namf']) +
		    (row['cand_naml'].nil? ? "" : row['cand_naml']) + "%"
	  recipient = Party::Committee.where("lower(name) like lower(?)", search).first
	end

	if recipient.nil? then
	  search = "%" + row['cand_naml'] + "%" + expn_date[0, 4] + "%"
	  recipient = Party::Committee.where("lower(name) like lower(?)", search).first
	end

	if recipient.nil? then
	  # Can't match with the year, try without.
	  search = "%" + row['cand_naml'] + "%"
	  recipient = Party::Committee.where("lower(name) like lower(?)", search).first
	end

	if (recipient.nil?) then
	  return
	end
      else
	recipient = Party::Committee
		 .where(name: "Measure " + row['bal_num'] + " " + expn_date[0, 4])
		 .first_or_create(committee_id: -1)
      end
      # Add the entry into the IEC table.
      ::IEC.where(recipient: recipient, contributor: contributor,
		   transaction_id: row['tran_id'], date: expn_date,
		   amount: row['amount'],
		   description: row['expn_dscr'].nil? ? row[',payyee_naml'] : row['expn_dscr'],
		   support: row['sup_opp_cd'] == "S").first_or_create()

      # If its an opposition expenditure we are done.
      if (row['sup_opp_cd'] == "O") then
	return
      end
      
      # Add this as if it were a contribution supporting the issue/candidate.
      ::Contribution.where(recipient: recipient, transaction_id: row['tran_id']).first_or_create(
        contributor: contributor,
        amount: row['amount'],
        date: expn_date,
        type: 'independent'
      )
    end
  end
end

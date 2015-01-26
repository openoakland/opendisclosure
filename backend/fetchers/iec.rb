require 'backend/fetchers/base'

class DataFetcher::IEC < DataFetcher::Base
  def validate_row(row)
    # the 496 and 465 have differnt column names
    row['expn_date'] = row['exp_date'] if row['exp_date']

    # attempt to find the recipient during validation so we can give good error
    # feedback; stick it on the row object so we don't have to do the costly
    # queries again during row processing
    row['_od_recipient'] = get_recipient(row)

    return 'No recipient found' unless row['_od_recipient']
    return 'Outside jurisdiction' if !row['juris_dscr'].nil? && !/oakland/i.match(row['juris_dscr'])
    return 'Outside jurisdiction' if !row['bal_juris'].nil? && !/oakland/i.match(row['bal_juris'])
  end

  def parse_row(row)
    contributor = get_filer(row)

    # Add the entry into the IEC table.
    ::IEC.where(recipient: row['_od_recipient'], contributor: contributor,
                transaction_id: row['tran_id'], date: row['expn_date'],
                amount: row['amount'],
                description: row['expn_dscr'].nil? ? row[',payyee_naml'] : row['expn_dscr'],
                support: row['sup_opp_cd'] == "S").first_or_create()

    # If its an opposition expenditure we are done.
    return if row['sup_opp_cd'] == "O"

    # Add this as if it were a contribution supporting the issue/candidate.
    ::Contribution.where(recipient: row['_od_recipient'], transaction_id: row['tran_id']).first_or_create(
      contributor: contributor,
      amount: row['amount'],
      date: row['expn_date'],
      type: 'independent'
    )
  end

  private

  def get_recipient(row)
    if row['bal_num'].nil?
      # The data only has candidate names. 
      # Sometimes they are only in one of the name fields.
      # Try to match first on both names with the year of the campaign as this tends to
      # be in the title of the comittee. It would be nice to use the elect_date field
      # but this does not seem to be entered so we use the exp_date.
      #
      # The Kaplan committee does not have her first name in the title
      # but an IEC does, avoid having it give money to itself.
      if row['cand_naml'] == 'Kaplan' && row['expn_date'][0, 4] == '2014' then
        search = 'Kaplan for Oakland Mayor 2014'
      else
        search = "%" + (row['cand_namf'].nil? ? "" : row['cand_namf']) +
          (row['cand_naml'].nil? ? "" : row['cand_naml']) +
          "%" + row['expn_date'][0, 4] + "%"
      end

      recipient = Party::Committee.where("lower(name) like lower(?)", search).first
      return recipient if recipient

      # Can't match with the year, try without.
      search = "%" + (row['cand_namf'].nil? ? "" : row['cand_namf']) +
        (row['cand_naml'].nil? ? "" : row['cand_naml']) + "%"
      recipient = Party::Committee.where("lower(name) like lower(?)", search).first
      return recipient if recipient

      search = "%" + row['cand_naml'] + "%" + row['expn_date'][0, 4] + "%"
      recipient = Party::Committee.where("lower(name) like lower(?)", search).first
      return recipient if recipient

      # Can't match with the year, try without.
      search = "%" + row['cand_naml'] + "%"
      recipient = Party::Committee.where("lower(name) like lower(?)", search).first
      return recipient if recipient
    else
      Party::Committee
        .where(name: "Measure " + row['bal_num'] + " " + row['expn_date'][0, 4])
        .first_or_create(committee_id: -1)
    end
  end
end

require 'backend/fetchers/base'

class DataFetcher::Payment < DataFetcher::Base
  def parse_row(row)
    payer = get_filer(row)

    recipient =
      case row['entity_cd']
      when 'COM', 'SCC'
        # entity being paid is a Committee and Cmte_ID will be set. Same thing as
        # Filer_ID but some names disagree
        Party::Committee.where(committee_id: row['cmte_id'])
                        .first_or_create(name: row['payee_naml'])

      when 'IND'
        # entity being paid is an Individual
        full_name = row.values_at('payee_naml', 'payee_namf', 'payee_nams')
                       .join(' ')
                       .strip
        Party::Individual.where(name: full_name,
                                city: row['payee_city'],
                                state: row['payee_state'],
                                zip: row['payee_zip4'])
                         .first_or_create
      when 'OTH'
        # payee is "Other"
        Party::Other.where(name: row['payee_naml'])
                    .first_or_create(city: row['payee_city'],
                                     state: row['payee_state'],
                                     zip: row['payee_zip4'])
      end

    ::Payment.create(payer: payer,
		     recipient: recipient,
		     amount: row['amount'],
		     code: row['expn_code'],
		     date: row['expn_date'])
  end
end

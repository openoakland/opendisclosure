class DataFetcher
  class CategoryContributions
    def self.run!
      ActiveRecord::Base.connection.execute <<-QUERY
        INSERT into category_contributions(recipient_id, name, contype, number, amount)
        SELECT
          r.id,
          r.name,
          case
	    when cont.self_contribution then 'Self Funded'
            when c.type = 'Party::Other' then
              case
                when maps.type = 'Union' then 'Union'
		when maps.type = 'PAC' then 'Political Action Committee'
                when l.firm is not null then 'Lobbyist'
              else 'Company'
              end
            when c.type = 'Party::Individual' AND
                l.name is not null OR l.firm is not null then 'Lobbyist'
	    when c.type = 'Party::Committee' and maps.type = 'Union' then 'Union'
            else substring(c.type, 8)
          end as ConType, count(*), sum(amount)
        FROM
          contributions cont,
          parties r,
          (parties c
          left outer join maps on name = emp2
          left outer join lobbyists l on
             c.name = l.name or c.name = l.firm or c.employer = l.firm)
        WHERE
          r.committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','}) AND
          r.id = recipient_id AND
          c.id = contributor_id
        GROUP BY
          r.id, r.name, ConType
        ORDER BY
          r.id, r.name, ConType;
      QUERY
    end
  end
end

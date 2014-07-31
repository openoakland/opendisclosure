class DataFetcher
  class CategoryContributions
    def self.run!
      ActiveRecord::Base.connection.execute <<-QUERY
        INSERT into category_contributions(recipient_id, name, contype, number, amount)
        SELECT
          r.id,
          r.name,
          case
            when c.type = 'Party::Other' then
              case
                when maps.type = 'Union' then 'Union'
                when l.firm is not null then 'Lobbyist'
              else 'Company'
              end
            when c.type = 'Party::Individual' AND
                l.name is not null OR l.firm is not null then 'Lobbyist'
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
          r.id, r.name, sum(amount) desc;
      QUERY
    end
  end
end

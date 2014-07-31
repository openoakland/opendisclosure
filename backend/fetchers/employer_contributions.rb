class DataFetcher
  class EmployerContributions
    def self.run!
      ActiveRecord::Base.connection.execute <<-QUERY
        INSERT into employer_contributions(recipient_id, name, contrib, amount)
        SELECT s.id, candidate, contrib, sum(amount) as amount from
          (
            SELECT r.id, r.name as candidate,
             case
               when p.Emp1 = 'N/A' then c.occupation
               else p.Emp1
             end as contrib, amount
              FROM contributions b, parties r, parties c, maps p
              WHERE b.recipient_id = r.id AND b.contributor_id = c.id and
              r.committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','}) AND
              c.employer = p.Emp2 AND c.type = 'Party::Individual'
            UNION ALL
            SELECT r.id, r.name as candidate, p.Emp1 as contrib, amount
              FROM contributions b, parties r, parties c, maps p
              WHERE b.recipient_id = r.id AND b.contributor_id = c.id and
              r.committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','}) AND
              c.name = p.Emp2 AND c.type <> 'Party::Individual'
           ) s
        GROUP BY s.id, candidate, contrib
        ORDER BY s.id, candidate, sum(amount) desc;
      QUERY
    end
  end
end

class DataFetcher
  class EmployerContributions
    def self.run!
      ActiveRecord::Base.connection.execute <<-QUERY
      	INSERT into employers(employer_name)
	SELECT DISTINCT s.contrib FROM
	   (
            SELECT 
             CASE
               WHEN p.Emp1 = 'N/A' THEN c.occupation
               ELSE p.Emp1
             END AS contrib
              FROM contributions b,  parties c, maps p
              WHERE b.contributor_id = c.id AND
              c.employer = p.Emp2 AND c.type = 'Party::Individual'
            UNION ALL
            SELECT p.Emp1 AS contrib
              FROM contributions b, parties c, maps p
              WHERE b.contributor_id = c.id AND
              c.name = p.Emp2 AND c.type <> 'Party::Individual'
           )s
      QUERY
      ActiveRecord::Base.connection.execute <<-QUERY
        UPDATE parties c SET employer_id = e.id
	FROM employers e, maps p
	WHERE CASE
	  WHEN p.Emp1 = 'N/A' THEN c.occupation
	  ELSE p.Emp1
        END = e.employer_name AND
	c.employer = p.Emp2 AND c.type = 'Party::Individual'
      QUERY
      ActiveRecord::Base.connection.execute <<-QUERY
        UPDATE parties c SET employer_id = e.id
	FROM employers e, maps p
	WHERE p.Emp1 = e.employer_name AND
	c.name = p.Emp2 AND c.type <> 'Party::Individual'
      QUERY
      ActiveRecord::Base.connection.execute <<-QUERY
        INSERT into employer_contributions(recipient_id, employer_id, name, contrib, amount)
        SELECT r.id, e.id, r.name, e.employer_name, sum(amount) as amount
	FROM contributions b, parties r, parties c, employers e
	WHERE b.recipient_id = r.id AND b.contributor_id = c.id AND e.id = c.employer_id
	  AND r.committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','})
        GROUP BY e.id, r.id
      QUERY
    end
  end
end

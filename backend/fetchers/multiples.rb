class DataFetcher
  class Multiples
    def self.run!
      ActiveRecord::Base.connection.execute <<-QUERY
        INSERT into multiples(contributor_id, number)
        SELECT contributor_id, count(distinct recipient_id)
        FROM contributions, parties r
        WHERE r.id = recipient_id AND
          r.committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','})
        GROUP BY contributor_id
        HAVING count(distinct recipient_id) > 1
        ORDER BY count(distinct recipient_id) desc;
      QUERY
    end
  end
end

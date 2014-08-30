class DataFetcher
  class Whales
    def self.run!
      ActiveRecord::Base.connection.execute <<-QUERY
        INSERT into whales(contributor_id, amount)
        SELECT contributor_id, sum(amount)
        FROM contributions, parties
        WHERE amount IS NOT NULL AND recipient_id = parties.id AND committee_id <> 0 AND
          ( committee_id in (#{Party::MAYORAL_CANDIDATE_IDS.join ','}) OR
          committee_id in (#{Party::CANDIDATE_IDS.join ','}))
        GROUP BY contributor_id
        ORDER BY sum(amount) desc
        LIMIT 10;
      QUERY
    end
  end
end

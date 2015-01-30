class DataFetcher
  class CategoryPayments
    def self.run!
      ActiveRecord::Base.connection.execute <<-QUERY
	INSERT INTO category_payments (payer_id, text, code, amount)
	SELECT  payer_id, 
	  COALESCE(text, 'Not stated'), p.code, sum(amount)
	FROM (payments p left outer join payment_codes c
		      on p.code = c.code)
	GROUP BY payer_id, text, p.code
	ORDER BY payer_id, text
      QUERY
    end
  end
end

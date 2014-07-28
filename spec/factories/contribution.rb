FactoryGirl.define do
  factory :contribution do
    trait :from_json do
      initialize_with do
        JSON.parse(<<-RESPONSE)
          {
            "thru_date" : "2011-12-31T00:00:00",
            "entity_cd" : "IND",
            "intr_self" : "n",
            "tran_zip4" : "94710",
            "rpt_date" : "2012-01-31T00:00:00",
            "tran_state" : "CA",
            "form_type" : "A",
            "rec_type" : "RCPT",
            "tran_id" : "A6",
            "filer_naml" : "Derrick H Muhammad for City Council 2012",
            "filer_id" : "1342709",
            "committee_type" : "RCP",
            "tran_occ" : "Longshoreman",
            "tran_amt2" : "100",
            "tran_amt1" : "100",
            "tran_nams" : "Jr",
            "tran_city" : "Berkeley",
            "tran_namf" : "James",
            "tran_emp" : "Pacific Maritime Assn/ILWU",
            "tran_self" : "n",
            "from_date" : "2011-01-01T00:00:00",
            "tran_naml" : "Curtis",
            "report_num" : "0",
            "tran_date" : "2011-12-07T00:00:00"
          }
        RESPONSE
      end
    end
  end
end

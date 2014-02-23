// Delete everything
MATCH (n) OPTIONAL MATCH (n)-[r]->() DELETE n, r;

CREATE INDEX ON :Entity(name);
CREATE INDEX ON :City(name);
CREATE INDEX ON :Occupation(name);

// Load contributions data
LOAD CSV WITH HEADERS FROM "file:///tmp/A-Contributions.csv" AS line
WITH line,
CASE line.Entity_Cd
  WHEN "IND" THEN line.Tran_NamF + " " + line.Tran_NamL
  ELSE line.Tran_NamL END AS contributorName,
toInt(round(coalesce(toFloat(line.Tran_Amt1), 0.0))) AS amount
MERGE (f:Entity {name: line.Filer_NamL})
SET f:Recipient,
    f.id = line.Filer_ID,
    f.committeeType = line.Committee_Type
MERGE (c:Entity {name: contributorName})
SET c:Contributor,
    c.zip = substring(line.Tran_Zip4, 0, 5),
    c.occupation = line.Tran_Occ
MERGE (c)-[n:CONTRIBUTED {amount: amount, date: line.Tran_Date}]->(f)
SET
    n.desc = line.Tran_Dscr
FOREACH(n IN (CASE line.Tran_Emp WHEN "" THEN [] else [line.Tran_Emp] END) |
  MERGE (e:Entity {name: n})
  SET e:Employer
  MERGE (c)-[:EMPLOYER]->(e)
)
FOREACH(n IN (CASE line.Tran_City WHEN "" THEN [] else [upper(line.Tran_City)] END) |
  MERGE (p:City {name: n, state: line.Tran_State})
  MERGE (c)-[:LOCATION]->(p)
)
FOREACH(n IN (CASE line.Tran_Occ WHEN "" THEN [] else [upper(line.Tran_Occ)] END) |
  MERGE (o:Occupation {name: n})
  MERGE (c)-[:WORKS_AS]->(o)
);


// Load expenditure data
LOAD CSV WITH HEADERS FROM "file:///tmp/E-Expenditure.csv" AS line
WITH line,
CASE line.Entity_Cd
  WHEN "IND" THEN line.Payee_NamF + " " + line.Payee_NamL
  ELSE line.Payee_NamL END AS vendorName,
toInt(round(coalesce(toFloat(line.Amount), 0.0))) AS amount
MERGE (f:Entity {name: line.Filer_NamL})
SET f:Recipient,
    f.id = line.Filer_ID,
    f.committeeType = line.Committee_Type
MERGE (v:Entity {name: vendorName})
SET v:Vendor
MERGE (f)-[n:PAYED {amount: amount, date: line.Expn_Date}]->(v)
SET
    n.desc = line.Expn_Dscr
FOREACH(n IN (CASE line.Payee_City WHEN "" THEN [] else [upper(line.Payee_City)] END) |
  MERGE (p:City {name: n, state: line.Payee_State})
  MERGE (v)-[:LOCATION]->(p)
);


// Label the known Mayoral Candidates with a :Candidate label
MATCH (f:Entity)
WHERE f.name IN [
  "Patrick McCullough Mayor 2014",
  "Parker for Oakland Mayor 2014",
  "Re-Elect Mayor Quan 2014",
  "Libby Schaaf for Oakland Mayor 2014",
  "Joe Tuman for Mayor 2014"
]
SET f:Candidate;

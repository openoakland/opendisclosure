Disclosure Data in Neo4j
========================

## Warning!

The Neo4j part of the project, while cool and promising, is not currently part
of the project nor something the OpenDisclosure team is currently developing.
This folder is here for historical purposes and in case anyone happens upon
this project who is passionate about graph databases and wants to play around
with this stuff.

## Overview

Importing in the [Neo4j Graph Database](http://neo4j.org) allows for analysis and querying of this connected data. Neo4j can then be used to answer questions of interest, and provide data for visulatizations.

## Importing data

The raw data from Oakland's "NetFile" site (http://ssl.netfile.com/pub2/Default.aspx?aid=COAK) needs the A-Contributions and E-Expenditures sheets saved to CSV. The [import.cyp](import.cyp) will then load these into Neo4j (it assumes they are saved in /tmp).

```
curl -b /dev/null -L -o - "https://docs.google.com/spreadsheet/ccc?key=0AgAZooSCCSN0dGUwVXdHQzlXamwxSEVtcTVzMHNZN1E&output=csv&gid=0" > /tmp/A-Contributions.csv
curl -b /dev/null -L -o - "https://docs.google.com/spreadsheet/ccc?key=0AgAZooSCCSN0dGUwVXdHQzlXamwxSEVtcTVzMHNZN1E&output=csv&gid=8" > /tmp/E-Expenditure.csv

wget http://dist.neo4j.org/neo4j-community-2.1.0-M01-unix.tar.gz
tar xzf neo4j-community-2.1.0-M01-unix.tar.gz
cd neo4j-community-2.1.0-M01
./bin/neo4j start
./bin/neo4j-shell -file import.cyp
```

## Visualizing

Using the Neo4j browser (http://localhost:7474), data can be visualized by running queries in the [Cypher query language](http://cypherlang.org).

```
// Candidates and contributors who provided over $700
MATCH (f:Candidate) // Find all the candidates
OPTIONAL MATCH (f)<-[n:CONTRIBUTED]-(c) WHERE n.amount > 700 // Find the contributors giving > $700
OPTIONAL MATCH (c)-[:LOCATION|EMPLOYER|WORKS_AS]->(l) // Match additional data abount contributors for visualization
RETURN f, c, l
```

![Screen Shot](http://cl.ly/image/0v2u0A1e3e0q/Screen%20Shot%202014-02-23%20at%2012.33.32%20AM.png)

## Querying data

Using the [Cypher query language](http://cypherlang.org), the following questions can be answered:

[1. Who are the top 5-10 contributors to each campaign? (people or company)](https://github.com/openoakland/opendisclosure/issues/3)

```
MATCH (f:Candidate)
OPTIONAL MATCH (f)<-[n:CONTRIBUTED]-(c)
WITH f, c, sum(n.amount) AS amount ORDER BY amount DESC
RETURN f.name AS candidate, collect({name: c.name, amount: amount})[0..10] AS contributors
```
| candidate                   | contributors
|-----------------------------|-----------------------------------------
|Patrick McCullough Mayor 2014| [{name:"Patrick McCullough",amount:100}]
|Re-Elect Mayor Quan 2014     | [{name:"Sprinkler Fitters & Apprentices Local 483 PAC, id#1298012",amount:1400},{name:"IBEW PAC Educational Fund",amount:1400},{name:"IUPAT-Political Action Together-Political Committee",amount:1400},{name:"Electrical Workers Local 595 PAC",amount:1300},{name:"Steven Douglas",amount:700},{name:"ARCALA Land Company",amount:700},{name:"Conway Jones, Jr.",amount:700},{name:"Annie Tsai",amount:700},{name:"Ronald Herron",amount:700},{name:"Lailan Huen",amount:700}]"
|Parker for Oakland Mayor 2014| [{name:"Scott Taylor",amount:700},{name:"Larry Williams",amount:700},{name:"Terrence McGrath",amount:700},{name:"Joseph Whitehouse",amount:700},{name:"Pamela Lathan",amount:700},{name:"Rob Davenport",amount:700},{name:"Ed Page",amount:700},{name:"Nneka Rimmer",amount:700},{name:"John Lewis",amount:700},{name:"Mobile Connectory LLC",amount:700}]
Libby Schaaf for Oakland Mayor 2014|[{name:"Sal Fahey",amount:1000},{name:"John Protopappas",amount:700},{name:"Joan Story",amount:700},{name:"Richard Schaaf",amount:700},{name:"Antioch Street Limited",amount:700},{name:"Lang Scoble",amount:700},{name:"Paul Weinstein",amount:700},{name:"Bradley Brownlow",amount:700},{name:"Jerrold Kram",amount:700},{name:"Julian Beasley",amount:700}]
|Joe Tuman for Mayor 2014     | [{name:"James and Darcy Diamantine",amount:1400},{name:"Tod & Jen Vedock",amount:1400},{name:"John and Alanna Dittoe",amount:1400},{name:"Bill/Warrine Young/Coffey",amount:1400},{name:"Mr and Mrs EM Edward Downer",amount:1400},{name:"Mark & Susan Stutzman",amount:1400},{name:"Leonard & Silvia Silvani",amount:1400},{name:"Bradford & Barbara Dickason",amount:1400},{name:"Robert & Ann Spears",amount:1400},{name:"Patricia & Tony Theophilos",amount:1400}]

[2. Which industries support each candidate? (top 5 industries, aggregate amount given from this industry to each candidate, percentage that this contribution makes in the committee’s entire fundraising efforts for this reporting period)](https://github.com/openoakland/opendisclosure/issues/4)

_The import data does not yet contain industry information (although there is Occupation?)_

[3. Bar graph showing how much campaign committee has raised so far versus how much that committee has spent in expenditures on the campaign.](https://github.com/openoakland/opendisclosure/issues/5)

```
MATCH (f:Candidate)
OPTIONAL MATCH (f)<-[n:CONTRIBUTED]-()
WITH f, sum(n.amount) AS received
OPTIONAL MATCH (f)-[n:PAYED]->()
WITH f, received, sum(n.amount) AS spent
RETURN f.name AS candidate, spent, received, received - spent AS balance ORDER BY balance DESC
```
candidate|spent|received|balance
---------|-----|--------|-------
Parker for Oakland Mayor 2014|33783|166884|133101
Joe Tuman for Mayor 2014|19119|140100|120981
Libby Schaaf for Oakland Mayor 2014|4293|117795|113502
Re-Elect Mayor Quan 2014|39215|121522|82307
Patrick McCullough Mayor 2014|0|100|100

[4. What percentage of campaign contributions to each mayoral candidate are made from Oakland residents vs. others?](https://github.com/openoakland/opendisclosure/issues/6)

```
MATCH (f:Candidate)
OPTIONAL MATCH (f)<-[n:CONTRIBUTED]-(c)
WHERE (c)-[:LOCATION]->({name:'OAKLAND', state:'CA'})
WITH f, sum(n.amount) AS oakContributions
OPTIONAL MATCH (f)<-[n:CONTRIBUTED]-(c)
WITH f, oakContributions, sum(n.amount) as total
RETURN f.name AS candidate, round((toFloat(oakContributions) / total) * 100) AS percentage ORDER BY percentage DESC
```

candidate|percentage
---------|----------
Patrick McCullough Mayor 2014|100
Joe Tuman for Mayor 2014|67
Libby Schaaf for Oakland Mayor 2014|53
Re-Elect Mayor Quan 2014|51
Parker for Oakland Mayor 2014|35

[5. Evaluate any overlap between corporations and industries that employ and register a lobbyist with the City of Oakland and campaign contribution and expenditure data.](https://github.com/openoakland/opendisclosure/issues/7)

_The import data does not yet contain industry information_

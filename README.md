[![Stories in Ready](https://badge.waffle.io/openoakland/opendisclosure.png?label=ready&title=Ready)](https://waffle.io/openoakland/opendisclosure)
opendisclosure
==============

## Overview

The goal of the project is to produce useful visualizations and statistics for Oakland's campaign finance data, starting with the November 2014 mayoral race.

Meeting notes can be found in [this Google Doc](https://docs.google.com/document/d/11xji54-RiszyFBQnSBOI5Ylmzn2vC9glwAoU6A8CM_0/edit?pli=1#).

## Running Locally

To start, you'll need ruby installed.

    brew install rbenv
    brew install ruby-build
    rbenv install 2.1.2

Then install bundler and foreman:

    gem install bundler
    gem install foreman

Install postgres:

```bash
brew install postgres

# choose one:
# A) to start postgres on startup:
ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist

# B) or, to run postgres in a terminal (you will have to leave it running)
postgres -D /usr/local/var/postgres

ARCHFLAGS="-arch x86_64" gem install pg
```

Now you can install the other dependencies with:

    bundle install

Create your postgresql user: (may be unnecessary, depending on how postgres is
installed):

    sudo -upostgres createuser $USER -P
    # enter a password you're not terribly worried to share
    echo DATABASE_URL="postgres://$USER:[your password]@localhost/postgres" > .env

You should be all set. Run the app like this:

    foreman start

Then, to get a local copy of all the data:

    bundle exec ruby backend/load_data.rb

## Data Source

The raw, original, separated-by-year data can be found on Oakland's "NetFile"
site here: http://ssl.netfile.com/pub2/Default.aspx?aid=COAK

We process that data in a nightly ETL process. Every day (or so) [this
dataset][1] is updated with the latest version of the data. **There is a [data
dictionary of what all the columns mean here][2].**

## Name mapping

When we aggregate to find top contributors by company and employee, we use a mapping table to correct for spelling errors and different ways of representing the same entity.  This is stored in backend/map.csv and gets loaded into the maps table during the data load process.

Since there is no easy way to calculate when two entities are the same updating the maps table requires human intervention. Here are the steps to update the data:

1) load the most recent data (see above).
2) In your favorite Postgres interface run this query and export it:
	SELECT DISTINCT * FROM (
	  SELECT  0, name, name FROM parties c, contributions 
	  WHERE contributor_id = c.id AND c.type <> 'Party::Individual'
	    AND NOT name =ANY (SELECT Emp2 FROM maps)
	  UNION ALL SELECT  0, employer, employer FROM parties c, contributions 
	  WHERE contributor_id = c.id AND c.type ='Party::Individual'
	    AND NOT employer =ANY (SELECT Emp2 FROM maps)
	) s
4) load map.csv and this new data into your favorite column oriented data processing tool
	e.g. Excel
5) sort on the Emp1 column
6) Search for rows that have 0 in the first column and see if they are equivalent
	to any near by entity.  If they are, copy the value of Emp1 from that row
	to this one.  If the entity is a union but "Union" in the type column.
	In some cases an equivalent entity might not sort near by, e.g:
		San Fransisco Bay Area Rapid Transit District : BART
		City of Oakland : Oakland, city of
		California Senate : State of CA Senate
7) Renumber the first column so all are unique.  In Excel or equivalent you can
	set the first row to 1 and the second row to =A1+1 and copy that forumla to
	all the other rows.

## Deploying

In order to deploy to production ([opendisclosure.io]) you will need a couple things:

1. A public-private SSH keypair (use the `ssh-keygen` command to make one)
2. A [Heroku](https://heroku.com) account. Make sure to associate it with your
   public key (`~/.ssh/id_rsa.pub`)
3. Permission for your Heroku account to deploy. You can get this from the
   current OpenDisclosure maintainers.

Then, you can deploy via git:

    # first time setup:
    git remote add heroku git@heroku.com:opendisclosure.git

    # to deploy:
    git checkout master
    # highly recommended: run `git log` so you know what will be deployed. When
    # ready to deploy, run:
    git push heroku master

Make sure to push changes back to this repository as well, so that heroku and
this repository's master branch stay in-sync!

[1]: https://data.oaklandnet.com/dataset/Campaign-Finance-FPPC-Form-460-Schedule-A-Monetary/3xq4-ermg
[2]: https://data.sfgov.org/Ethics/Campaign-Finance-Data-Key/wygs-cc76

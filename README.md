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

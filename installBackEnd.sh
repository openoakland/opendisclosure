#!/usr/bin/env bash

echo "This script will attempt to install the OpenDisclosure back end in a Vagrant box"

sudo apt-get update
sudo apt-get -y install curl
sudo apt-get -y install ruby-full git 
sudo gem install -y bundler
sudo gem install -y foreman
sudo aptitude install -y postgresql
#this line gives an error:
ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
#ln: failed to create symbolic link ‘/home/vagrant/Library/LaunchAgents’: No such file or directory
#couldn't find ref to "ln" in  history from last week... 
#checking the week before last week ... same line was used then
#trying install anyway, if it works, erase the line about the ln
sudo ARCHFLAGS="-arch x86_64" gem install pg
#got error here too:
# ERROR:  Error installing pg:
# 	ERROR: Failed to build gem native extension.

#         /usr/bin/ruby1.9.1 extconf.rb
# checking for libpq-fe.h... no
# Can't find the 'libpq-fe.h header
# Can't find the 'libpq-fe.h header
# *** extconf.rb failed ***
# Could not create Makefile due to some reason, probably lack of
# necessary libraries and/or headers.  Check the mkmf.log file for more
# details.  You may need configuration options.
git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
source .bash_profile
#sudo apt-get install libopenssl-devel libreadline-devel
#sudo apt-get install openssl-devel readline-devel
#it appears the names of the preceeding packages are wrong
# Reading package lists... Done
# Building dependency tree
# Reading state information... Done
# E: Unable to locate package libopenssl-devel
# E: Unable to locate package libreadline-devel
echo "installing libssl-dev libreadline-dev g++ libpq-dev ... "
sudo apt-get -y install libssl-dev libreadline-dev g++ libpq-dev

echo "Running rbenv install 2.1.2"
rbenv install 2.1.2
rbenv global 2.1.2

echo "installing the pg gem"
gem install pg -v '0.17.1'

echo "installing bundler"
gem install bundler

echo "Cloning the opendisclosure git repo..."

git clone https://github.com/openoakland/opendisclosure.git

cd opendisclosure/
source ~/.bash_profile

echo "Installing the bundle..."
bundle install
#old error here: Your Ruby version is 1.9.3, but your Gemfile specified 2.1.2

#gem install pg -v '0.17.1'
#did this in one of the preceeding lines

#sudo -u postgres createuser postgres -P
#the preceeding line likely is not necessarry and creates this error after entering a space as the password
#createuser: creation of new role failed: ERROR:  role "postgres" already exists

echo "Preparing the database"
sudo -u postgres createuser -d -s vagrant

echo DATABASE_URL="postgres://$USER:password@localhost/vagrant" > .env

sudo -u postgres psql -c "ALTER USER vagrant WITH PASSWORD 'password';"
sudo service postgresql restart
createdb vagrant

source ~/.bash_profile
#load the data
echo "Loading the data ... "
bundle exec ruby backend/load_data.rb

echo "All installation steps complete or attempted."
echo "If all went without error, you should be able to run these commands"
echo "> source ~/.bash_profile"
echo "> cd opendisclosure"
echo "> foreman start"
echo "then enter 127.0.0.1:5000 into the address bar in an internet"
echo "browser on this computer and see the Open Disclosure homepage."

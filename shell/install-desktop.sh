#!/bin/bash

# Preparing system

sudo apt-get install nodejs npm haproxy libsqlite3-dev 
sudo npm install -g node-gyp

# Webdav

npm install jsDAV

# Restify

npm install restify

# Sql

npm install mysql
npm install sqlite3

# Cookies

npm install cookies
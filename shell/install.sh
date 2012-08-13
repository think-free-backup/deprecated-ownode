#!/bin/bash

# THIS SCRIPT IS NOT TESTED - USE IT AS AN INSTALL NOTE

# Preparing system

sudo apt-get install nodejs npm haproxy libsqlite3-dev 

sudo mkdir /opt/ownode
sudo chmod 777 /opt/ownode
cd /opt/ownode

sudo umount /tmp

# Webdav

npm install jsDAV

wget http://registry.npmjs.org/libxml/-/libxml-0.0.3.tgz
tar xvf libxml-0.0.3.tgz 
cd package/
sed -i "s|'-msse2',||" ./support/o3/build/c4che/Release.cache.py
sed -i "s|'-msse2',||" ./support/o3/wscript
npm install

# Restify

npm install restify

# Sqlite

sudo npm install -g node-gyp

    // configure sqlite + make

npm install cookies
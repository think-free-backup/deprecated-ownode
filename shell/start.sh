#!/bin/bash
 

node api.js &
node webdav.js &

sleep 5

sudo haproxy -f config/haproxy.cfg -V &

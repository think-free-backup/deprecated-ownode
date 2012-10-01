#!/bin/bash

echo "Generating server key"
openssl genrsa -out server.key 4096 
echo "Generating csr.pem"
openssl req -days 3650 -new -key server.key -out csr.pem -subj "/C=ES/ST=Denial/L=World/O=Ownode/CN=www.ownode.org"
echo "Generating cert.pem"
openssl x509 -req -in csr.pem -signkey server.key -out cert.pem


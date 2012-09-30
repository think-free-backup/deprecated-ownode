#!/bin/bash


openssl genrsa -out $1.pem 2048
openssl rsa -pubout -in $1.pem -out $1.pub

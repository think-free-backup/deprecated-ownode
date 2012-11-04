#!/bin/bash

if [ ! -d keys ];
then
	mkdir keys
fi

if [ ! -f keys/$1.pem ];
then
	openssl genrsa -out keys/$1.pem 4096
	openssl rsa -pubout -in keys/$1.pem -out keys/$1.pub
	exit 0
else
	exit -1
fi

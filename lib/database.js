/* This library if for basic database management */

Mysql = require('mysql').Client;
base = require('./base');
var cfManager = require("./configManager");

exports.createDB = function(config,db,callback){

    var mysql = new Mysql();
    mysql.user = config.mysqlRootUser;
    mysql.password = config.mysqlRootPassword;
    mysql.host = config.mysqlHost;

    // Creating the database

    mysql.query ('create database ' + config.mysqlDatabase , function(err, results, fields){
        if (err){
            console.log("MYSQL ERROR : ");
            console.log(err);
            mysql.end();
            return;
        }

        // Generating user if needed

        if (config.mysqlUser === ""){
            config.mysqlUser = base.getUid(16);
            config.mysqlPassword = base.getUid();
        }

        // Creating user and grant privileges

        mysql.query('GRANT ALL ON ' + config.mysqlUser + '.* TO ' + config.mysqlUser + '@' + config.mysqlHost + ' IDENTIFIED BY \'' + config.mysqlPassword + '\'',function(err, results, fields){
            if (err){
                console.log("MYSQL ERROR : ");
                console.log(err);
                mysql.end();

                return config;
            }

            config.userDBCreated = true;
            cfManager.writeConfig(config);

            mysql.end();
            console.log("DATABASE CREATED");

            callback(config);
        });

    });

    mysql.end();
    return;
}

exports.init = function(config,db){
    db = new Mysql();
    db.user = config.mysqlUser;
    db.password = config.mysqlPassword;
    db.host = config.mysqlHost;
}
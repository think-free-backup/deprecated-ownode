        
/* **************************************************************** 
 *
 *  Description : Database managment
 *  License :     All the sources are available under the GPL v3
 *                http://www.gnu.org/licenses/gpl.html
 *  Author : Christophe Meurice
 *  
 *  (C) Meurice Christophe 2012
 *
 ****************************************************************** */

var Mysql = require('mysql'); //.Client;
var base = require('./base');
var cfManager = require("./configManager");
var log = require('./log.js');

exports.createDB = function(config,db,callback){

    // var mysql = new Mysql();
    // mysql.user = config.mysqlRootUser;
    // mysql.password = config.mysqlRootPassword;
    // mysql.host = config.mysqlHost;

    var mysql = Mysql.createConnection({
      host     : config.mysqlHost,
      user     : config.mysqlRootUser,
      password : config.mysqlRootPassword,
    });

    mysql.connect();

    // Creating the database


    mysql.query('DROP DATABASE ' + config.mysqlDatabase, function(err, results, fields){  // TODO :  Check if database exists and ask user if we should remove the database (with timeout)
        if (err){
            log.write("api-database","createDB","MYSQL ERROR : ");
            log.write("api-database","createDB",err);

            return;
        }
        else{
            log.write("api-database","createDB","Database removed");
        }
    });

    mysql.query ('create database ' + config.mysqlDatabase , function(err, results, fields){
        if (err){
            log.write("api-database","createDB","MYSQL ERROR : ");
            log.write("api-database","createDB",err);

            return;
        }

        // Generating user if needed

        if (config.mysqlUser === ""){
            config.mysqlUser = base.getUid(16);
            config.mysqlPassword = base.getUid();
        }

        // Creating user and grant privileges

        mysql.query('GRANT ALL ON ' + config.mysqlDatabase + '.* TO ' + config.mysqlUser + '@' + config.mysqlHost + ' IDENTIFIED BY \'' + config.mysqlPassword + '\'',function(err, results, fields){
            if (err){
                log.write("api-database","createDB","MYSQL ERROR : ");
                log.write("api-database","createDB",err);

                return config;
            }

            config.userDBCreated = true;
            cfManager.writeConfig(config);

            mysql.end();
            log.write("api-database","createDB","DATABASE CREATED");

            callback(config);
        });

    });

    return;
}

exports.init = function(config,db){
    // db = new Mysql();
    // db.user = config.mysqlUser;
    // db.password = config.mysqlPassword;
    // db.host = config.mysqlHost;
    // db.database = config.mysqlDatabase;

    var db = Mysql.createConnection({
      host     : config.mysqlHost,
      user     : config.mysqlRootUser,
      password : config.mysqlRootPassword,
      database : config.mysqlDatabase
    });

    db.connect();

    return db;
}


exports.tableDontExists = function(table,db,config,callback){

    db.query( 'SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = \'' + config.mysqlDatabase + '\' AND table_name = \'' + table + '\'',function(err, results, fields){
        if (err){
            log.write("api-database","tableDontExists",err);
            return;
        }
        else{
            if (results[0].count == 0){
                callback();
            }
        }
    } );
}

exports.printError = function (err, results, fields){
    if (err){
        log.write("api-database","printError",err);
    }
}
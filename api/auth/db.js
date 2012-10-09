var database = require('../../lib/database');

exports.init = function(db,config){

    console.log("Init auth database");

    database.tableDontExists('users',db,config,function(){
        db.query ('create table users (uid INT NOT NULL AUTO_INCREMENT, name CHAR(30) NOT NULL, password CHAR(30) NOT NULL, PRIMARY KEY(uid) )' , function (err, results, fields){
            if (err){
                console.log(err);
            }
            db.query('insert into users(name,password) values (\'root\',\'root\')', database.printError);
        });
    });

    database.tableDontExists('groups',db,config,function(){
        db.query ('create table groups (gid INT NOT NULL AUTO_INCREMENT, name CHAR(30) NOT NULL, PRIMARY KEY(gid) )' , function (err, results, fields){
            if (err){
                console.log(err);
            }
            db.query('insert into groups(name) values (\'admin\')', database.printError);
        });
    });

    database.tableDontExists('userInGroup',db,config,function(){
        db.query ('create table userInGroup (uid INT NOT NULL, gid INT NOT NULL)' , function (err, results, fields){
            if (err){
                console.log(err);
            }
            db.query('insert into userInGroup(uid,gid) values (1,1)', database.printError);
        });
    });

    database.tableDontExists('sessions',db,config,function(){
        db.query ('create table sessions (uid INT, usid CHAR(32), sid CHAR(32), expire CHAR(32))' , database.printError);
    });
};
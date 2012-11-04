        
/* **************************************************************** 
 *
 *  Description : Authentication database managment
 *  License :     All the sources are available under the GPL v3
 *                http://www.gnu.org/licenses/gpl.html
 *  Author : Christophe Meurice
 *  
 *  (C) Meurice Christophe 2012
 *
 ****************************************************************** */

var database = require('../../lib/database');
var libAuth = require('./lib/auth');

exports.init = function(db,config){

    console.log("Init auth database");

    database.tableDontExists('users',db,config,function(){
        db.query ('create table users (uid INT NOT NULL AUTO_INCREMENT, name CHAR(32) NOT NULL, host CHAR(64) NOT NULL,  password CHAR(32) NOT NULL, baseGroup CHAR(32) NOT NULL, PRIMARY KEY(uid) )' , function (err, results, fields){
            if (err){
                console.log(err);
            }
            libAuth.addUser(db,'root',config.serverHostname,'root','root',function(ans){
                if (ans.status == "ok"){
                    libAuth.createUserKey('root',function(){console.log("User root added");});
                }
                else
                    console.log("Error : " + body);
            });
        });
    });

    database.tableDontExists('groups',db,config,function(){
        db.query ('create table groups (gid INT NOT NULL AUTO_INCREMENT, name CHAR(32) NOT NULL, PRIMARY KEY(gid) )' , function (err, results, fields){
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
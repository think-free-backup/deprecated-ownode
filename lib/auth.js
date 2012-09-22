
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var base = require('./base');

// # Database

// ## Create the user database
exports.createDatabase = function(){

    if (!path.existsSync('config/users.sqlite')) {

        console.log("Creating database");

        var db = new sqlite3.Database('config/users.sqlite');

        db.serialize(function() {
            db.run("CREATE TABLE users (uid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT)");
            db.run("CREATE TABLE groups (gid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
            db.run("CREATE TABLE userInGroup (uid TEXT, gid TEXT)");
            db.run("CREATE TABLE sessions (uid TEXT, usid TEXT, sid TEXT, expire TEXT)");
            db.run("INSERT INTO users (name,password) VALUES ('root','root')");

            db.run("CREATE TABLE serverConfig (key TEXT, value TEXT)");
            db.run("INSERT INTO serverConfig(key,value) VALUES ('serverID', '" + base.getUid() +"' ");
        });

        db.close();

        return true;
    }
    else
        return false;
}

// # Session management

// ## Create a new session
exports.createSession = function(uid){

    var session = {
        status : "ok",
        user : base.getUid(),
        sid : base.getUid()
    };

    var db = new sqlite3.Database('config/users.sqlite');

    db.serialize(function() {
        db.run("INSERT INTO sessions (uid,usid,sid,expire) VALUES (?,?,?,?)", [uid, session.user, session.sid, base.getCurrentTimeStamp() + 86400], function(){
            db.close();
        });
    });



    return session;
};

// ## Get uid from user/password
exports.checkCredential = function(user,password,callback){

    var db = new sqlite3.Database('config/users.sqlite');

    db.serialize(function() {

        db.get("SELECT uid FROM users where name = ? and password = ? ",[user,password] , function(err, row) {

            db.close();

            if (row != undefined){

                // > Getting user id

                var uid = row.uid;

                callback(uid);
            }
            else{
                callback(-1);
            }

        });

    });
};

// ## Check if a session is valid
exports.isSessionValid = function(usid, sid,callback){

    // > Check undefined or not and check if values passed are not sql injection
    if (usid === undefined || sid === undefined){
        callback(-1);
    }
    else{
        // > Database request to check if the session is correct or not

        var db = new sqlite3.Database('config/users.sqlite');

        var users = new Array();

        db.serialize(function() {

            db.get("SELECT uid,expire FROM sessions where usid = ? and sid = ? ",[usid,sid] , function(err, row) {

                db.close();

                if (row != undefined){

                    if ( row.expire > base.getCurrentTimeStamp() ){
                        callback(row.uid);
                    }
                    else{
                        callback(-3);
                    }
                }
                else{
                    callback(-2);
                }
            });
        });


    }
};

// ## Remove a session
exports.deleteSession = function(usid, sid, callback){
    var db = new sqlite3.Database('config/users.sqlite');
    db.run("delete from sessions where usid = ? and sid = ?",[usid,sid],function(){
        db.close();
        if (callback !== undefined)
            callback();
    });

};

// ## Create a new user
exports.addUser = function(user,pass,callback){

    var db = new sqlite3.Database('config/users.sqlite');

    db.serialize(function() {
        db.run("INSERT INTO users (name,password) VALUES (' " + user + " ',' " + pass + " ')", function(){
            db.close();
            if (callback !== undefined)
                callback();
        });
    });
};

// ## Delete a user
exports.delUser = function(user,callback){
    var db = new sqlite3.Database('config/users.sqlite');

    db.serialize(function() {
        db.run("DELETE FROM users WHERE name = ' " + user +" '", function(){
            db.close();
            if (callback !== undefined)
                callback();
        });
    });
};

// ## Modify a user password
exports.modifyUserPassword = function(uid, pass,callback){

};

// ## Add a group
exports.addGroup = function(group,callback){

};

// ## Delete a group
exports.delGroup = function(group,callback){

};

// ## Add a user to a group
exports.addUserToGroup = function(user,group,callback){

};

// ## Remove a user from a group
exports.delUserFromGroup = function(user,group,callback){

};

// ## List groups of user
exports.userGroups = function(user,callback){

};
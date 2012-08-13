
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
        db.run("INSERT INTO sessions (uid,usid,sid,expire) VALUES (?,?,?,?)", [uid, session.user, session.sid, base.getCurrentTimeStamp() + 86400]);
    });

    db.close();

    return session;
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

        db.close();
    }
};

// ## Remove a session
exports.deleteSession = function(usid, sid){

};
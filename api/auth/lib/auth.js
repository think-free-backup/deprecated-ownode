
var path = require('path');
var base = require('../../../lib/base');
var database = require('../../../lib/database');

// # Database

// # Session management

// ## Create a new session
exports.createSession = function(db,uid){

    var session = {
        status : "ok",
        user : base.getUid(),
        sid : base.getUid()
    };


        db.query("INSERT INTO sessions (uid,usid,sid,expire) VALUES (?,?,?,?)", [uid, session.user, session.sid, base.getCurrentTimeStamp() + 86400],database.printError);




    return session;
};

// ## Get uid from user/password
exports.checkCredential = function(db,user,password,callback){

    db.query("SELECT uid FROM users where name = ? and password = ? ",[user,password] , function(err, results, fields) {

        if (err){
            callback (-1);
            return;
        }

        if (results[0] != undefined && results[0].uid != undefined){

            callback(results[0].uid);
        }
        else{
            callback(-1);
        }
    });

};

// ## Check if a session is valid
exports.isSessionValid = function(db,usid, sid,callback){

    // > Check undefined or not and check if values passed are not sql injection
    if (usid === undefined || sid === undefined){
        callback(-1);
    }
    else{
        // > Database request to check if the session is correct or not

        var users = new Array();

        db.query("SELECT uid,expire FROM sessions where usid = '" + usid + "' and sid = '" + sid + "' " , function(err, results, fields) {

            if (err){
                callback (-3);
                return;
            }

            if (results[0] != undefined){

                if ( results[0].expire > base.getCurrentTimeStamp()){
                    callback(results[0].uid);
                }
                else{
                    callback(-2);
                }
            }
            else{
                callback(-1);
            }
        });
    }
};

// ## Remove a session
exports.deleteSession = function(db,usid, sid, callback){
    db.query("delete from sessions where usid = ? and sid = ?",[usid,sid],function(){

        if (callback !== undefined)
            callback();
    });

};

// ## Create a new user
exports.addUser = function(db,user, host, password, baseGroup, callback){

    // If the host is ! local > password can be empty (login is only allowed by key)
    // Base group is : root, user, invited, remote

    // The key should be managed by the called of this function (create public/private key if local, add the posted key to key store if remote)
    // Groups array should alse be managed by the called of this function

    db.query("INSERT INTO users (name,host,password,baseGroup) VALUES ('" + user + "', '" + host + "' ,'" + password + "','" + baseGroup + "')", function(err, results, fields){

        if (err){
            console.log(err);
            return;
        }

        if (callback !== undefined)
            callback();
    });
};

// ## Delete a user
exports.delUser = function(db,user,callback){

    db.query("DELETE FROM users WHERE name = ' " + user +" '", function(){

        if (err){
            console.log(err);
            return;
        }

        if (callback !== undefined)
            callback();
    });
};

// ## Modify a user password
exports.modifyUserPassword = function(db,uid, pass,callback){

};

// ## Add a group
exports.addGroup = function(db,group,callback){

};

// ## Delete a group
exports.delGroup = function(db,group,callback){

};

// ## Add a user to a group
exports.addUserToGroup = function(db,user,group,callback){

};

// ## Remove a user from a group
exports.delUserFromGroup = function(db,user,group,callback){

};

// ## List groups of user
exports.userGroups = function(db,user,callback){
    // Should return an array with the baseGroup in the first position and the group array following
};
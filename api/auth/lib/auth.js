        
/* **************************************************************** 
 *
 *  Description : Librairy for authentication
 *  License :     All the sources are available under the GPL v3
 *                http://www.gnu.org/licenses/gpl.html
 *  Author : Christophe Meurice
 *  
 *  (C) Meurice Christophe 2012
 *
 ****************************************************************** */

var path = require('path');
var base = require('../../../lib/base');
var database = require('../../../lib/database');
var cfManager = require("../../../lib/configManager");
var exec = require('child_process').exec;
var log = require('../../../lib/log');

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

// # User managment

// ## Create a new user
exports.addUser = function(db,user, host, password, baseGroup, callback){

    // The key should be managed by the caller of this function (create public/private key if local, add the posted key to key store if remote)
    // Groups array should also be managed by the called of this function
    // Base group is : root, user, invited, remote

    var config = cfManager.loadConfig();

    if (host == config.serverHostname){
        if (password == ""){
            if (callback !== undefined)
                callback({status : "error", body : "password can't be empty for localhost"});    
            return;
        }
    }
    else{
        if (baseGroup != "invited"){
            if (callback !== undefined)
                callback({status : "error", body : "remote user can't be in an other group than invited"});    
            return;   
        }
    }

    db.query("INSERT INTO users (name,host,password,baseGroup) VALUES ('" + user + "', '" + host + "' ,'" + password + "','" + baseGroup + "')", function(err, results, fields){

        if (err){
            log.write("api-auth","addUser",err);
            if (callback !== undefined)
                callback({status : "error", body : err});
            return;
        }

        if (callback !== undefined)
            callback({status : "ok", body : "User added"});
    });

    if (config.userSystemScriptForUserManagment){
        exec('shell/addUser.sh ' + user);
    }
};

// ## Delete a user
exports.delUser = function(db,user,callback){

     exports.getUidFromName(db,user,function(r_uid){

        if (r_uid < 0){
            callback({status : "error", body : "Can't get ugid : " + r_uid});
            return;
        }
        else{

            db.query("DELETE FROM userInGroup where uid = '" + r_uid + "'", function(err, results, fields){

                if (err){
                    log.write("api-auth","delUser",err);
                    if (callback !== undefined)
                        callback({status : "error", body : err});
                    return;
                }

                db.query("DELETE FROM users WHERE name = ' " + user +" '", function(){

                    if (err){
                        log.write("api-auth","delUser",err);
                        return;
                    }

                    if (callback !== undefined)
                        callback();
                });
            });
        }
    });
};

// ## Create a user public/private key
exports.createUserKey = function(user,callback){

    exec('shell/genkey.sh ' + user,callback);
}

// ## Modify a user password /* TODO  */
exports.modifyUserPassword = function(db,uid, pass,callback){

};

// # Group managment

// ## Add a group
exports.addGroup = function(db,group,callback){

    db.query("INSERT INTO groups (name) VALUES ('" + group + "')", function(err, results, fields){

        if (err){
            log.write("api-auth","addGroup",err);
            if (callback !== undefined)
                callback({status : "error", body : err});
            return;
        }

        if (callback !== undefined)
            callback({status : "ok", body : "Group added"});
    });
};

// ## Delete a group
exports.delGroup = function(db,group,callback){

    exports.getGidFromName(db,group,function(r_gid){

        if (r_gid < 0){
            callback({status : "error", body : "Can't get gid : " + r_gid});
            return;
        }
        else{

            db.query("DELETE FROM userInGroup where gid = '" + r_gid + "'", function(err, results, fields){

                if (err){
                    log.write("api-auth","delGroup",err);
                    if (callback !== undefined)
                        callback({status : "error", body : err});
                    return;
                }

                db.query("DELETE FROM groups where name = '" + group + "'", function(err, results, fields){

                    if (err){
                        log.write("api-auth","delGroup",err);
                        if (callback !== undefined)
                            callback({status : "error", body : err});
                        return;
                    }

                    if (callback !== undefined)
                        callback({status : "ok", body : "Group deleted"});
                });
            });
        }
    });
};

// ## Add a user to a group
exports.addUserToGroup = function(db,user,group,callback){

    var uid,gid;

    // Getting uid

    exports.getUidFromName(db,user,function(r_uid){

        if (r_uid < 0){
            callback({status : "error", body : "Can't get uid : " + r_uid});
            return;
        }
        else{

            uid = v_uid;

            // Getting gid

            exports.getGidFromName(db,group,function(r_gid){

                if (r_gid < 0){
                    callback({status : "error", body : "Can't get gid : " + r_gid});
                    return;
                }
                else{

                    gid = v_gid;

                    // Inserting uid, gid in userInGroup

                    db.query("INSERT INTO userInGroup (uid,gid) VALUES ('" + uid + "','" + gid + "')", function(err, results, fields){

                        if (err){
                            log.write("api-auth","addUserToGroup",err);
                            if (callback !== undefined)
                                callback({status : "error", body : err});
                            return;
                        }

                        if (callback !== undefined)
                            callback({status : "ok", body : "Group added"});
                        return;
                    });
                }
            });
        }
    });
};

// ## Remove a user from a group
exports.delUserFromGroup = function(db,user,group,callback){

    var uid,gid;

    // Getting uid

    exports.getUidFromName(db,user,function(r_uid){

        if (r_uid < 0){
            callback({status : "error", body : "Can't get uid : " + r_uid});
            return;
        }
        else{

            uid = v_uid;

            // Getting gid

            exports.getGidFromName(db,group,function(r_gid){

                if (r_gid < 0){
                    callback({status : "error", body : "Can't get gid : " + r_gid});
                    return;
                }
                else{

                    gid = v_gid;

                    // Inserting uid, gid in userInGroup

                    db.query("DELETE FROM userInGroup where uid = '" + uid + "' and gid = '" + gid + "' ", function(err, results, fields){

                        if (err){
                            log.write("api-auth","delUserFromGroup",err);
                            if (callback !== undefined)
                                callback({status : "error", body : err});
                            return;
                        }

                        if (callback !== undefined)
                            callback({status : "ok", body : "Group removed"});
                        return;
                    });
                }
            });
        }
    });
};

// ## List groups of user
exports.userGroups = function(db,user,callback){

    exports.getUidFromName(db,user,function(r_uid){

        if (r_uid < 0){
            callback({status : "error", body : "Can't get uid : " + r_uid});
        }
        else{

            db.query("SELECT g.name FROM groups g join userInGroup ug on g.gid = ug.gid join users u on ug.uid = u.uid where u.uid = '" + r_uid + "'", function(err, results, fields){

                if (err){

                    log.write("api-auth","userGroups",err);
                    if (callback !== undefined)
                        callback({status : "error", body : err});
                }
                else{

                    if (callback !== undefined){
                        var ar = new Array();
                        for (var g in results){
                            ar.push(results[g].name);
                        }
                        callback({status : "ok", body : ar});
                    }
                }
            });
        }
    }); 
};

// ## Tell if user is in the group passed as parameter /* TODO */
exports.userIsInGroup = function(db,user,group,callback){
    
}

// # Helper functions uid/gid from name, ...

// ## Return the uid from the name
exports.getUidFromName = function(db,user,callback){
    db.query("SELECT uid FROM users where name = '" + user + "'", function(err, results, fields){

        if (err){
            log.write("api-auth","getUidFromName",err);
            if (callback !== undefined)
                callback(-1);
            return;
        }

        if (results[0] != undefined)
            callback(results[0].uid);
        else
            callback(-2);
    });
}

// ## Return the gid from the name
exports.getGidFromName = function(db,user,callback){
    db.query("SELECT gid FROM groups where name = '" + group + "'", function(err, results, fields){

        if (err){
            log.write("api-auth","getGidFromName",err);
            if (callback !== undefined)
                callback(-1);
            return;
        }

        if (results[0] != undefined)
            callback(results[0].gid);
        else
            callback(-2);
    });
}

// ## Return the user name from the user session id /* TODO */
exports.getUserFromSession = function(db, session, callback){
    
}

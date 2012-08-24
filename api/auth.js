/* This module is for authentication of the user */

var Cookies = require("cookies");
var path = require('path');
var auth = require('../lib/auth');
var sqlite3 = require('sqlite3').verbose();


exports.login = function(req,res,next){

    // > Check if logged and logout to remove current session

    var cookies = new Cookies( req, res, null );
    var user = cookies.get("user");
    var session = cookies.get("session");

    auth.isSessionValid(user,session,function(uid){

        if ( uid > 0 ){

            // > Removing the session
            auth.deleteSession(user,session,follow); // FIXME : DATABASE MAY BE LOCKED
        }
        else{
            follow();
        }

        // > Check if the user/password are correct and get the uid

        function follow(){
            auth.checkCredential(req.params.user,req.params.pass,function(uid){
                if (uid != -1){
                    var session = auth.createSession(uid);

                    // > Setting cookies

                    if (session.status == "ok"){
                        var cookies = new Cookies( req, res, null );

                        cookies.set( "user", session.user, {  httpOnly: false } );
                        cookies.set( "session", session.sid, {  httpOnly: false } );

                        res.json({status : "ok"});
                    }
                    else{
                        res.json({status : "error", body : "can't create session" });
                    }
                }
                else{
                    res.json({status : "user/password invalid" });
                }
            });
        }

    });
};

exports.isLogged = function(req,res,next){

    // > Get the cookies values

    var cookies = new Cookies( req, res, null );

    auth.isSessionValid(cookies.get("user"), cookies.get("session"),function(uid){

        if ( uid > 0 ){

            res.json({status : "logged"});
        }
        else{
            switch (uid){
                case -1 :
                    res.json({status : "not logged", body : "not logged"});
                    break;
                case -2 :
                    res.json({status : "not logged", body : "session invalid"});
                    break;
                case -3 :
                    res.json({status : "not logged", body : "session expired"});
                    break;
                default :
                    res.json({status : "not logged", body : "undefined error"});
                    break;
            }
        }
    });
};

exports.logout = function(req,res,next){
    // > Check if logged and logout to remove current session

    var cookies = new Cookies( req, res, null );
    var user = cookies.get("user");
    var session = cookies.get("session");

    auth.isSessionValid(user,session,function(uid){

        if ( uid > 0 ){

            // > Removing the session
            auth.deleteSession(user,session); // FIXME : DATABASE MAY BE LOCKED
            res.json({status : "ok", body : "session deleted"});
        }
        else{
            res.json({status : "nok", body : "session doesn't exists" });
        }
    });
};

exports.addUser = function(req,res,next){

};

exports.delUser = function(req,res,next){

};



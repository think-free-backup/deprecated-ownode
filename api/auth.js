/* This module is for authentication of the user */

var Cookies = require("cookies");
var path = require('path');
var auth = require('../lib/auth');
var sqlite3 = require('sqlite3').verbose();


exports.login = function(req,res,next){

    // > Check if logged and logout to remove current session

    // > Check if the user/password are correct and get the uid

    var db = new sqlite3.Database('config/users.sqlite');

    db.serialize(function() {

        db.get("SELECT uid FROM users where name = ? and password = ? ",[req.params.user,req.params.pass] , function(err, row) {

            if (row != undefined){

                // > Getting user id

                var uid = row.uid;

                // > Create a session

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

    });

    db.close();
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

};

exports.addUser = function(req,res,next){

};

exports.delUser = function(req,res,next){

};



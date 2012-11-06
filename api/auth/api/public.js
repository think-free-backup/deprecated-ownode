        
/* **************************************************************** 
 *
 *  Description : Public part for authentication
 *  License :     All the sources are available under the GPL v3
 *                http://www.gnu.org/licenses/gpl.html
 *  Author : Christophe Meurice
 *  
 *  (C) Meurice Christophe 2012
 *
 ****************************************************************** */

var Cookies = require("cookies");
var path = require('path');
var auth = require('../lib/auth');
var log = require('../../../lib/log');

exports.login = function(db,req,res,next){

    // > Check if logged and logout to remove current session

    var cookies = new Cookies( req, res, null );
    var user = cookies.get("user");
    var session = cookies.get("session");

    auth.isSessionValid(db,user,session,function(uid){

        if ( uid > 0 ){

            // > Removing the session
            auth.deleteSession(db,user,session,follow); // FIXME : DATABASE MAY BE LOCKED
        }
        else{
            follow();
        }

        // > Check if the user/password are correct and get the uid

        function follow(){
            auth.checkCredential(db,req.params.user,req.params.pass,function(uid){
                if (uid != -1){
                    var session = auth.createSession(db,uid);

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

exports.isLogged = function(db,req,res,next){

    // > Get the cookies values

    var cookies = new Cookies( req, res, null );

    auth.isSessionValid(db,cookies.get("user"), cookies.get("session"),function(uid){

        if ( uid > 0 ){

            res.json({status : "logged"});
        }
        else{
            switch (uid){
                case -1 :
                    res.json({status : "not logged", body : "You are not logged"});
                    break;
                case -2 :
                      res.json({status : "not logged", body : "session expired"});
                    break;
                default :
                    res.json({status : "not logged", body : "undefined error"});
                    break;
            }
        }
    });
};

exports.logout = function(db,req,res,next){
    // > Check if logged and logout to remove current session

    var cookies = new Cookies( req, res, null );
    var user = cookies.get("user");
    var session = cookies.get("session");

    auth.isSessionValid(db,user,session,function(uid){

        if ( uid > 0 ){

            // > Removing the session
            auth.deleteSession(db,user,session); // FIXME : DATABASE MAY BE LOCKED
            res.json({status : "ok", body : "session deleted"});
        }
        else{
            res.json({status : "nok", body : "session doesn't exists" });
        }
    });
};


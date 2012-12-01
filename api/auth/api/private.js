		
/* **************************************************************** 
 *
 *  Description : Private part for authentication
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


exports.addUser = function(db,req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.delUser = function(db,req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.addGroup = function(db,req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.delGroup = function(db,req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.addUserToGroup = function(db,req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.delUserFromGroup = function(db,req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.userGroups = function(db,req,res,next){
	var cookies = new Cookies( req, res, null );

    auth.getUserNameFromSession(db, cookies.get("user"), cookies.get("session"), function(uid){

        auth.userGroups(db,uid,function(json){
            res.json(json);
        });
    });
};

exports.requestFriendShip = function(db,req,res,next){
	res.json({status : "error", body : "Not implemented"});
}
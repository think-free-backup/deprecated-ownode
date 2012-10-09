/* This module is for authentication of the user */

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
    res.json({status : "error", body : "Not implemented"});
};
/* This module is for authentication of the user */

var Cookies = require("cookies");
var path = require('path');
var auth = require('../../lib/auth');
var sqlite3 = require('sqlite3').verbose();


exports.addUser = function(req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.delUser = function(req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.addGroup = function(req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.delGroup = function(req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.addUserToGroup = function(req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.delUserFromGroup = function(req,res,next){
    res.json({status : "error", body : "Not implemented"});
};

exports.userGroups = function(req,res,next){
    res.json({status : "error", body : "Not implemented"});
};
"use strict";

var jsDAV = require("jsDAV/lib/jsdav"),
	jsDAV_Auth_Backend_Ownode = require("jsDAV/lib/DAV/plugins/auth/ownode"),
    jsDAV_Locks_Backend_FS = require("jsDAV/lib/DAV/plugins/locks/fs");

// setting debugMode to TRUE outputs a LOT of information to console
//jsDAV.debugMode = true;

jsDAV.createServer({
    node: __dirname + "/data",
    locksBackend: new jsDAV_Locks_Backend_FS(__dirname + "/data/.locks"),
	authBackend: new jsDAV_Auth_Backend_Ownode(),
	realm:"OwNode-Webdav"
}, 8001);

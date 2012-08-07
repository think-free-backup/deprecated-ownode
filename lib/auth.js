/* This module is for authentication of the user */
 
function auth(){
	
	this.checkLogin = function(req,res,next,user){
		
		var sqlite3 = require('sqlite3').verbose();
		var db = new sqlite3.Database('config/maindb.sqlite');

		var users = new Array();
		
		db.serialize(function() {
			var path = require('path');
			if (!path.existsSync('config/maindb.sqlite')) {
				db.run("CREATE TABLE lorem (info TEXT)");

				var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
				for (var i = 0; i < 10; i++) {
					stmt.run("Ipsum " + i);
				}
				stmt.finalize();
			}
			
			
			db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
				
				users.push({id : row.id, info : row.info});
				
			}, function(){
				
				res.json({content : users});
			});			
		});

		db.close();	
	};
} 

module.exports = auth;
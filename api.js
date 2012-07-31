var restify = require('restify');

function version(req, res, next){
  res.send('Api version : 0.1');
}

function respond(req, res, next) {
	
	var sqlite3 = require('sqlite3').verbose();
		var db = new sqlite3.Database('config/maindb.sqlite');

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
			var users = new Array();
			
			db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
				console.log(row.id + ": " + row.info);
				users[row.id] = row.info;
			});
			
			console.log(users);
		});

		db.close();
	
  res.send('hello ' + req.params.name);
}

var server = restify.createServer();
server.get('/', version);
server.head('/', version);
server.get('/api', version);
server.head('/api', version);


server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(8000, function() {
  console.log('%s listening at %s', server.name, server.url);
});


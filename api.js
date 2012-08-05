var restify = require('restify');
var lib = require('./lib');

function version(req, res, next){
  res.send('Api version : 0.1');
}

function authenticate(req, res, next){
	console.log(req.path);
	console.log(req.query);
	console.log(req.params);
	

}

function respond(req, res, next) {
	var module = lib['auth'];
	var obj = new module();
	obj['checkLogin'](req,res,next,"user");
}

var server = restify.createServer();
server.use(restify.queryParser({ mapParams: true }));

// # Routes

// ## Api version
server.get('/', version);
server.head('/', version);
server.get('/api', version);
server.head('/api', version);

// ## Authentication
server.get('/auth/:name', authenticate);
server.head('/auth/:name', authenticate);

// ## Hello
server.get('/app/:app/:function', respond);
server.head('/app/:app/:function', respond);

// # Starting server

server.listen(8000, function() {
  console.log('%s listening at %s', server.name, server.url);
});


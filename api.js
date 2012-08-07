var restify = require('restify');
var lib = require('./lib');

function version(req, res, next){
  res.send('Api version : 0.1');
}

function authenticate(req, res, next){
	res.json({token : "users"});
}

function respond(req, res, next) {
	var module = lib['auth'];
	var obj = new module();
	obj['checkLogin'](req,res,next,"user");
}

var server = restify.createServer();
server.use(restify.queryParser({ mapParams: true }));
server.use(restify.bodyParser({ mapParams: true }));

// # Routes

// ## Api version

server.get('/', version);
server.get('/api', version);

// ## Authentication

server.get('/auth/:name', authenticate);
server.post('/auth/:name', authenticate);

// ## Hello

server.get('/app/:app/:function', respond);


// # Starting server

server.listen(8000, function() {
  console.log('%s listening at %s', server.name, server.url);
});


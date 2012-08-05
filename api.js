var restify = require('restify');
var lib = require('./lib');

function version(req, res, next){
  res.send('Api version : 0.1');
}

function respond(req, res, next) {
	var module = lib['auth'];
	var obj = new module();
	obj['checkLogin'](req,res,next,"user");
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


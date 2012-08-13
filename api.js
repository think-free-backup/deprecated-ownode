// This program is a personal cloud server api
// All the sources are available under the GPL v3 : http://www.gnu.org/licenses/gpl.html
// (C) Meurice Christophe 2012

// # Includes

var restify = require('restify');
var path = require('path');
var auth = require('./lib/auth');

// # Configuration

var config = {
    server : "pw+",
    version : "0.0.1",
    api : "0.0.1",
    apiRoute : "api",
    appRoute : "apps",
    port : 8000,
    configured : false
};

if (path.existsSync('config/maindb.sqlite')) {
    config.configured = true;
}
else{
    auth.createDatabase();
}

var api = [];
var apps = [];

// # Loading core api

// # Loading applications

require("fs").readdirSync("./" + config.apiRoute).forEach(function(file) {
    var name = file.split(".js")[0];
    api[name] = require("./" + config.apiRoute + "/" + file);
    console.log("Loading api module : " + name);
});

// # Loading applications

require("fs").readdirSync("./" + config.appRoute).forEach(function(file) {
    var name = file.split(".js")[0];
    apps[name] = require("./" + config.appRoute + "/" + file);
    console.log("Loading application module : " + name);
});

// # Creating server

var server = restify.createServer();
server.name = config.name + " " + config.version;
server.use(restify.queryParser({ mapParams: true }));
server.use(restify.bodyParser({ mapParams: true }));

// # Routes

// ## Api version

server.get('/', version);
server.get('/version', version);

// ## Core api

server.get('/core/:module/:function', callApi);

// ## Applications

server.get('/app/:app/:function', callApplication);

// # Starting server

server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});

// # Access methods

// ## Version of the server

function version(req, res, next){
    res.json(config);
}

// ## Core api call

function callApi(req,res,next){

    // TODO : Check here if loged or not except for the login and isLogged

    var module = api[req.params.module];

    if (module != undefined){
        var fct = module[req.params.function];
        if (fct != undefined){
            fct(req,res,next);
            return;
        }
    }

    // Module / function not found
    res.json({type : "error", body : "This application/function doesn't exist in the api"});
}

// ## 3rdParty application call

function callApplication(req, res, next) {

    // TODO : Check here if loged or not

    var module = apps[req.params.app];

    if (module != undefined){
        var fct = module[req.params.function];
        if (fct != undefined){
            fct(req,res,next);
            return;
        }
    }

    // Module / function not found
    res.json({type : "error", body : "This application/function doesn't exist in the api"});
}

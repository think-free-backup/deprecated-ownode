        
/* **************************************************************** 
 *
 *  Description : Configuration managment
 *  License :     All the sources are available under the GPL v3
 *                http://www.gnu.org/licenses/gpl.html
 *  Author : Christophe Meurice
 *  
 *  (C) Meurice Christophe 2012
 *
 ****************************************************************** */

var fs = require('fs');
var path = require('path');

// ## Configuration management

exports.loadConfig = function(){

    var filecontent;

    if (path.existsSync('config/config.js')){
        filecontent = fs.readFileSync ('config/config.js');
    }
    else{
        filecontent = fs.readFileSync ('config/config-sample.js');
    }

    var config = JSON.parse(filecontent);

    return config;
}

exports.writeConfig = function(config){

    var file = fs.openSync("config/config.js", "w");
    var filecontent = JSON.stringify(config);

    fs.writeSync(file, filecontent, 0);
}
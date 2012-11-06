		
/* **************************************************************** 
 *
 *  Description : Log managment
 *  License :     All the sources are available under the GPL v3
 *                http://www.gnu.org/licenses/gpl.html
 *  Author : Christophe Meurice
 *  
 *  (C) Meurice Christophe 2012
 *
 ****************************************************************** */

var fs = require('fs');
var logfile;

exports.init = function(path){

	fs.writeFile( path + '/node.log', '\033[31mStarting ownode log file on '+ new Date() +'\033[0m\n\n');

	logfile = fs.createWriteStream(path + '/node.log', {'flags': 'a'});
}

exports.write = function(application,fct,message){

	var date = new Date();
	var str = "\033[30m" + date + "\033[0m \033[34m[" + application + "::" + fct + "]\033[0m : " + message;
	console.log(str);

if (logfile)
	logfile.write(str + '\n');
}
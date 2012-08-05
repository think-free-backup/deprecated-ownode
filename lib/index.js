/* This file load all script on the current folder as a module */


var fs = require('fs');
var path = require('path');

module.exports = {};

// Just load up all the JS in this directory and export it.
fs.readdirSync(__dirname).forEach(function (file) {
  if (!/.+\.js$/.test(file))
    return;

  var plugin = require('./' + path.basename(file, '.js'));

  if (plugin && plugin.name)
    module.exports[plugin.name] = plugin;
});

var path  = require('path')
  , fs    = require('fs')

module.exports = function(server) {

  require('./hello')(server);

}
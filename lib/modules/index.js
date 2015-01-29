var path  = require('path')
  , fs    = require('fs')

module.exports = function(server) {

  server.settings.app.modules.forEach(function(m) {
    require('./' + m)(server);
  })

}
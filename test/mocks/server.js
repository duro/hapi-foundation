var Hapi    = require('hapi')
  , env     = process.env.NODE_ENV || 'dev'
  , config  = require('../../lib/config/' + env)

module.exports = function() {

  var server = new Hapi.Server({ app: config });

  server.connection({
      host: server.settings.app.server.host,
      port: server.settings.app.server.port
  });

  return server;

}
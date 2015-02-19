var Hapi      = require('hapi')
  , AppConfig = require('../../config')

module.exports = function() {

  var server = new Hapi.Server();

  server.connection({
      host: AppConfig.get('/server/host'),
      port: AppConfig.get('/server/port')
  });

  return server;

}
var Hapi    = require('hapi')
  , Hoek    = require('hoek')
  , env     = process.env.NODE_ENV || 'dev'
  , P       = require('bluebird')
  , config  = require('./lib/config/' + env);

// Create a server
var server = new Hapi.Server({
  app: config // Store static config
});

console.log('App Environment: ' + env);

// Create connection
server.connection({
    host: server.settings.app.server.host,
    port: server.settings.app.server.port
});

// Load application modules
require('./lib/modules')(server);

// Load plugins
function boot() {
  return new P(function(resolve, reject) {
    server.register(
      require('./lib/plugins')(server),
      function (err) {
        // Handle error
        if (err) {
          console.error(err);
          return reject(err);
        }
        // Start server (if not being included by test Lab)
        if (!module.parent) {
          server.start(function () {
            server.log(['server', 'info'], 'Server started at ' + server.info.uri);
            return resolve(server);
          });
        } else {
          return resolve(server);
        }
      }
    );
  });
}


module.exports = boot();

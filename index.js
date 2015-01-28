var Hapi    = require('hapi')
  , Hoek    = require('hoek')
  , config  = require('./config/' + process.env.NODE_ENV || 'dev');

// Create a server
var server = new Hapi.Server({
  app: config // Store static config
});

// Create connection
server.connection({
    host: server.settings.app.server.host,
    port: server.settings.app.server.port
});

// Load application modules
require('./lib/modules')(server);

// Load plugins
server.register(
  require('./lib/plugins')(server),
  function (err) {
    if (err) console.error(err);
    // Start server
    server.start(function () {
        console.info('Server started at ' + server.info.uri);
    });
  }
);

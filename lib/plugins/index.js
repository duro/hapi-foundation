module.exports = function(server) {

  var plugins = [];

  if (server.settings.app.logging.enabled) {
    plugins.push( require('./logging')(server) );
  }

  plugins.push( require('./mongoose')(server) );
  plugins.push( require('./swagger')(server) );
  // plugins.push( require('./modules')(server) );

  server.settings.app.modules.forEach(function(m) {
    plugins.push( require('../modules/' + m)(server) );
  });

  return plugins;

}
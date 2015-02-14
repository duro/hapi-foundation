module.exports = function(server) {

  var plugins = [];

  if (server.settings.app.logging.enabled) {
    plugins.push( require('./logging')(server) );
  }

  plugins.push( require('./mongoose')(server) );
  plugins.push( require('./swagger')(server) );

  plugins.push( require('../modules/hello')(server) );
  plugins.push( require('../modules/user')(server) );

  return plugins;

}
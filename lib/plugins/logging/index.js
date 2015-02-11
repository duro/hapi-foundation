module.exports = function(server) {

  return {
    register: require('good'),
    options: {
      opsInterval: 1000,
      reporters: server.settings.app.logging.reporters
    }
  };

}
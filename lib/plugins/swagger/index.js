module.exports = function(server) {

  return {
    register: require('hapi-swagger'),
    options: {
      basePath: server.settings.app.api.basepath,
      apiVersion: server.settings.app.pkg.version
    }
  };

}
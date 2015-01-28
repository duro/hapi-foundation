module.exports = function(server) {

  return {
    options: server.settings.app.database.mongodb,
    register: require('./register')
  }

}
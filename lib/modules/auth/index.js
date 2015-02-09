module.exports = function(server) {

  server.route({
    method: 'POST',
    path: '/register',
    config: {
      tags: ['api'],
      description: 'Register a new user',
      notes: 'Receives a new User object, and returns a logged in User object.',
      handler: require('./handlers/register')
    }
  });

}
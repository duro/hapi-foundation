var Joi = require('joi');

module.exports.register = function(server, options, next) {

  server.route({
    method: 'POST',
    path: '/register',
    config: {
      tags: ['api', 'auth'],
      description: 'Register a new user',
      notes: 'Receives a new User object, and returns a logged in User object.',
      handler: function(request, reply) {
        reply(200);
      },
      validate: {
        payload: {
          firstName: Joi.string().min(1).required(),
          lastName: Joi.string().min(1).required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required()
        }
      }
    }
  });

  next();
}

module.exports.register.attributes = {
  name: 'auth',
  version: '1.0.0'
}


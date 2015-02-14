var Joi = require('joi');

Joi.objectId = require('joi-objectid');

var UserController = function(server, options, next) {

  server.route({
    method: 'POST',
    path: '/user',
    config: {
      tags: ['api', 'user'],
      description: 'Create a new user',
      notes: 'Receives a new User object, and returns a logged in User object.',
      validate: {
        payload: {
          firstName: Joi.string().min(1).required(),
          lastName: Joi.string().min(1).required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(6)
        }
      },
      handler: require('./handlers/create')
    }
  });

  server.route({
    method: 'PUT',
    path: '/user/{id}',
    config: {
      tags: ['api', 'user'],
      description: 'Update a user',
      notes: 'Receives an updated User object',
      validate: {
        params: {
          id: Joi.objectId()
        },
        payload: {
          firstName: Joi.string().min(1),
          lastName: Joi.string().min(1),
          email: Joi.string().email(),
          password: Joi.string().min(6)
        }
      },
      handler: require('./handlers/update')
    }
  });

  next();
}

UserController.attributes = {
  name: 'user',
  version: '1.0.0'
}

module.exports = function(server) {
  return {
    register: UserController
  }
}
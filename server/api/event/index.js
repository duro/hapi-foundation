var Joi = require('joi');

Joi.objectId = require('joi-objectid');

exports.register = function(server, options, next) {

  server.route({
    method: 'POST',
    path: '/event',
    config: {
      tags: ['api', 'event'],
      description: 'Create a new Event',
      notes: 'Receives a new Event object, and returns the created Event object.',
      auth: 'token',
      validate: {
        payload: {
          title: Joi.string().min(4).required(),
          dateTime: Joi.date().required(),
          description: Joi.string()
        }
      },
      handler: require('./handlers/create')
    }
  });

  server.route({
    method: 'PUT',
    path: '/event/{id}',
    config: {
      tags: ['api', 'event'],
      description: 'Update an Event',
      notes: 'Receives an updated Event object, and returns the updated Event object.',
      auth: 'token',
      validate: {
        payload: {
          title: Joi.string().min(4).required(),
          dateTime: Joi.date().required(),
          description: Joi.string()
        }
      },
      handler: require('./handlers/update')
    }
  });

  next();
}

exports.register.attributes = {
  name: 'vt-api-event',
  version: '1.0.0'
}
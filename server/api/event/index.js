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

  next();
}

exports.register.attributes = {
  name: 'vt-api-event',
  version: '1.0.0'
}
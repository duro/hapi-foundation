var Joi = require('joi');

Joi.objectId = require('joi-objectid');

exports.register = function(server, options, next) {
  next();
}

exports.register.attributes = {
  name: 'vt-api-event',
  version: '1.0.0'
}
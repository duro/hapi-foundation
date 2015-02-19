var Joi = require('joi');

exports.register = function(server, options, next) {

  server.auth.strategy('token', 'bearer-access-token', {
    allowQueryToken: true,              // optional, true by default
    allowMultipleHeaders: false,        // optional, false by default
    accessTokenName: 'access_token',    // optional, 'access_token' by default
    validateFunc: require('./strategies/token')
  });

  server.route({
    method: 'POST',
    path: '/login',
    config: {
      tags: ['api', 'auth'],
      description: 'Login a user',
      notes: 'Receives an email and password, and returns a token to be used for subsequent calls.',
      validate: {
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }
      },
      handler: require('./handlers/login')
    }
  });

  next();
}

exports.register.attributes = {
  name: 'vt-api-auth',
  version: '1.0.0'
}

// module.exports = function(server) {
//   return {
//     register: AuthController
//   }
// }
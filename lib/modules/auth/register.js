var Joi     = require('joi')
  , Boom    = require('boom')
  , Promise = require('bluebird')
  , User    = require('../user/models/User');

module.exports.register = function(server, options, next) {

  server.route({
    method: 'POST',
    path: '/register',
    config: {
      tags: ['api', 'auth'],
      description: 'Register a new user',
      notes: 'Receives a new User object, and returns a logged in User object.',
      validate: {
        payload: {
          firstName: Joi.string().min(1).required(),
          lastName: Joi.string().min(1).required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required()
        }
      },
      handler: function(request, reply) {
        var payload = request.payload;

        // Search for any other users with same email adress
        User.where({email: payload.email}).countAsync()
          .then(function(count) {
            // If one is found, throw an error
            if (count > 0) {
              throw Boom.badRequest('The email provided for this user already exists')
            }
            return true
          })
          .then(function() {
            var user = User.massAssign(request.payload);

          })
          // Return the saved user
          .spread(function(user, numAffected) {
            return user;
          })
          // If there was some other kind of error saving to database, throw that
          .catch(Promise.OperationalError, function(err) {
            server.log(['error', 'api', 'auth'], err);
            throw Boom.badRequest('Object could not be saved to database. Check with administrator.');
          })
          .nodeify(reply);
      }
    }
  });

  next();
}

module.exports.register.attributes = {
  name: 'auth',
  version: '1.0.0'
}


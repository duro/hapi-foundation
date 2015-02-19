var Boom            = require('boom')
  , ValidationError = require('mongoose/lib/error/validation')
  , User            = require('../models/User')

module.exports = function(request, reply) {
  var payload = request.payload;

  User
    .where({_id: request.params.id })
    .findOneAsync()
    .then(function(user) {
      return user.massAssign(payload).saveAsync();
    })
    .get(0).then(reply)
    .catch(ValidationError, function(err) {
      var httpErr = Boom.badRequest('There was a validation error saving your request');
      httpErr.output.payload.errors = err.errors;
      reply(httpErr);
    })
    .catch(function(err) {
      server.log(['error', 'user', 'update'], err.toString());
      reply(err);
    });

}
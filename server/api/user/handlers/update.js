var Boom            = require('boom')
  , ValidationError = require('mongoose/lib/error/validation')
  , Promise         = require('bluebird')
  , User            = require('../models/User')

module.exports = function(request, reply) {
  var payload = request.payload;

  User.where({_id: request.params.id }).findOneAsync()
    .then(function(user) {
      return user.massAssign(payload).saveAsync();
    })
    .get(0)
    .catch(ValidationError, function(err) {
      var httpErr = Boom.badRequest('There was a validation error saving your request');
      httpErr.output.payload.errors = err.errors;
      throw httpErr;
    })
    .catch(Promise.OperationalError, function(err) {
      server.log(['error', 'user', 'update'], err.toString());
      throw err;
    })
    .nodeify(reply);

}
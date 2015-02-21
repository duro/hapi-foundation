var Boom            = require('boom')
  , ValidationError = require('mongoose/lib/error/validation')
  , Promise         = require('bluebird')
  , User            = require('../models/User')

module.exports = function(request, reply) {
  var payload = request.payload;

  User.massAssign(payload).saveAsync().get(0)
    .catch(ValidationError, function(err) {
      var httpErr = Boom.badRequest('There was a validation error saving your request');
      httpErr.output.payload.errors = err.errors;
      throw httpErr;
    })
    .catch(Promise.OperationalError, function(err) {
      request.server.log(['error', 'user', 'create'], err.toString());
      throw err;
    })
    .nodeify(reply);
}
var User  = require('../../user/models/User')
  , _     = require('lodash')
  , Boom  = require('boom');

module.exports = function(request, reply) {
  var payload = request.payload;

  User.findOneAsync({email: payload.email})
    .then(function(user) {
      if (!user) {
        return reply(Boom.unauthorized('no user with provided email found'));
      }
      var token = user.generateToken();
      return reply(_.extend(user.toJSON(), {token: token}));
    })
    .catch(reply);

}
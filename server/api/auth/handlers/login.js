var User  = require('../../user/models/User')
  , _     = require('lodash')
  , Boom  = require('boom');

module.exports = function(request, reply) {
  var payload = request.payload
    , user;

  User.findOneAsync({email: payload.email})
    .then(function(foundUser) {
      if (!foundUser) throw Boom.unauthorized('no user with provided email found');
      user = foundUser;
      return user.comparePassword(payload.password);
    })
    .then(function(compareResult) {
      if (compareResult.match) {
        var token = user.generateToken();
        return _.extend(user.toJSON(), { token: token })
      } else {
        throw Boom.unauthorized('password did not match');
      }
    })
    .nodeify(reply);

}
var jwt       = require('jwt-simple')
  , AppConfig = require('../../../../config')
  , User      = require('../../user/models/User');

module.exports = function( token, callback ) {
  // decode token to get userId from payload
  var userId = null;

  console.log('Validating');

  try {
    var payload = jwt.decode(token, AppConfig.get('/security/jwtSecret'));
    userId = payload.userId;
  } catch (err) {
    console.log("Error:", err);
  }

  if (userId) {
    User.findById(userId, function(err, user) {
      if (err) return callback(err);
      if (!user) return callback(null, false);
      return callback(null, true, user);
    });
  } else {
    return callback(null, false);
  }
}
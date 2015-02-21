var async = require('async');

module.exports = function(server, cb) {

  async.waterfall([
    // Create User
    function(next) {
      var newUserReq = {
        method: "POST",
        url: "/user",
        payload: {
          firstName: 'Adam',
          lastName: 'Test',
          email: 'adam@duromedia.com',
          password: 'whammmmy'
        }
      };
      server.inject(newUserReq, function(response) {
        user = JSON.parse(response.payload);
        next(null, user);
      });
    },
    // Login User
    function(user, next) {
      var loginReq = {
        method: "POST",
        url: "/login",
        payload: {
          email: user.email,
          password: 'whammmmy'
        }
      }
      server.inject(loginReq, function(response) {
        var payload = JSON.parse(response.payload);
        token = payload.token;
        next(null, payload);
      });
    }
  ], cb);

}
var Lab         = require("lab")
  , Code        = require('code')
  , Composer    = require('../../../index')
  , expect      = Code.expect
  , lab         = exports.lab = Lab.script()
  , moment      = require('moment')
  , async       = require('async');

var createAndLoginUser = require('./helpers/createAndLoginUser');

lab.experiment("Hello", function() {

  var server, user;

  lab.before(function(done) {
    async.waterfall([
      // Compose Server
      function(next) {
        Composer(function(err, composedServer) {
          server = composedServer;
          next(err);
        });
      },
      // Create and login a user
      function(next) {
        createAndLoginUser(server, function(err, loggedInUser) {
          if (err) return next(err);
          user = loggedInUser;
          next();
        })
      }
    ], done);
  });

  lab.test("should be able to create an Event", function(done) {
    var eventReq = {
      method: "POST",
      url: "/event",
      headers: {
        Authorization: 'Bearer ' + user.token
      },
      payload: {
        title: "Test Event",
        dateTime: moment().utc().add(7, 'days')
      }
    };

    server.inject(eventReq, function(response) {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);
      expect(payload._owner).to.equal(user._id);
      expect(payload.title).to.equal(eventReq.payload.title);
      expect(moment(payload.dateTime).isSame(eventReq.payload.dateTime)).to.be.true();

      done();
    });
  });

  lab.after(function(done) {
    server.plugins.mongoose.drop();
    server.plugins.mongoose.disconnect();
    done();
  });

});
var Lab         = require("lab")
  , Code        = require('code')
  , Composer    = require('../../../index')
  , expect      = Code.expect
  , lab         = exports.lab = Lab.script()
  , moment      = require('moment')
  , async       = require('async');

var createAndLoginUser = require('./helpers/createAndLoginUser');

lab.experiment("Event", function() {

  var server, user, evnt;

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

  lab.experiment('create', function() {
    lab.test("should be able to create an Event", function(done) {
      var eventReq = {
        method: "POST",
        url: "/event",
        headers: {
          Authorization: 'Bearer ' + user.token
        },
        payload: {
          title: "Test Event",
          dateTime: moment().utc().add(7, 'days'),
          description: "This is a description of the event"
        }
      };

      server.inject(eventReq, function(response) {
        var payload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(payload._owner).to.equal(user._id);
        expect(payload.title).to.equal(eventReq.payload.title);
        expect(payload.description).to.equal(eventReq.payload.description);
        expect(moment(payload.dateTime).isSame(eventReq.payload.dateTime)).to.be.true();

        evnt = payload;

        done();
      });
    });

    lab.test("should fail if title or dateTime is omitted", function(done) {
      async.parallel([
        // No datetime
        function(cb) {
          var eventReq = {
            method: "POST",
            url: "/event",
            headers: {
              Authorization: 'Bearer ' + user.token
            },
            payload: {
              title: "Test Event 2",
              description: "This is a description of the event"
            }
          };

          server.inject(eventReq, function(response) {
            var payload = JSON.parse(response.payload);

            expect(response.statusCode).to.equal(400);

            cb();
          });
        },
        // No title
        function(cb) {
          var eventReq = {
            method: "POST",
            url: "/event",
            headers: {
              Authorization: 'Bearer ' + user.token
            },
            payload: {
              dateTime: moment().utc().add(7, 'days'),
              description: "This is a description of the event"
            }
          };

          server.inject(eventReq, function(response) {
            var payload = JSON.parse(response.payload);

            expect(response.statusCode).to.equal(400);

            cb();
          });
        }
      ], done);
    });
  });

  lab.after(function(done) {
    server.plugins.mongoose.drop();
    server.plugins.mongoose.disconnect();
    done();
  });

});
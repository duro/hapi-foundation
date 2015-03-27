var Lab         = require("lab")
  , Code        = require('code')
  , Composer    = require('../../../index')
  , expect      = Code.expect
  , async       = require('async')
  , lab         = exports.lab = Lab.script();

lab.experiment("User", function() {

  var server;

  var newUser = {
        firstName: 'Adam',
        lastName: 'Test',
        email: 'adam@duromedia.com',
        password: 'whammmmy'
      }
    , existingUser
    , loggedInUser;

  lab.before(function(done) {
    Composer(function(err, composedServer) {
      server = composedServer;
      done(err);
    })
  });

  lab.experiment('create', function() {

    lab.test("should create a new user", function(done) {
      var options = {
        method: "POST",
        url: "/user",
        payload: newUser
      };

      server.inject(options, function(response) {
        var payload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(payload.password).to.not.exist();
        expect(payload.firstName).to.exist();
        expect(payload.lastName).to.exist();
        expect(payload.email).to.exist();

        existingUser = payload;

        done();
      });
    });

    lab.test("should fail creating a user with same email as existing user", function(done) {
      var options = {
        method: "POST",
        url: "/user",
        payload: newUser
      };

      server.inject(options, function(response) {
        var payload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(400);
        expect(payload.errors.email).to.exist();
        expect(payload.errors.email.message)
          .to.include("in use by another User");

        done();
      });
    });

  });

  lab.experiment('update', function() {

    lab.test('should be able to update', function(done) {

      async.waterfall([
        // Login the user
        function(next) {
          var loginReq = {
            method: "POST",
            url: "/login",
            payload: {
              email: existingUser.email,
              password: 'whammmmy'
            }
          }

          server.inject(loginReq, function(response) {
            var payload = JSON.parse(response.payload);

            expect(response.statusCode).to.equal(200);
            expect(payload.token).to.exist();

            loggedInUser = payload;

            next(null, payload);
          })
        },
        // Update user
        function(payload, next) {
          var updateReq = {
            method: "PUT",
            url: "/user",
            headers: {
              Authorization: 'Bearer ' + payload.token
            },
            payload: {
              firstName: "Love",
              lastName: "Lamp",
              email: "newemail@email.com"
            }
          }

          server.inject(updateReq, function(response) {
            var payload = JSON.parse(response.payload);

            expect(response.statusCode).to.equal(200);
            expect(payload.firstName).to.equal(updateReq.payload.firstName);
            expect(payload.lastName).to.equal(updateReq.payload.lastName);
            expect(payload.email).to.equal(updateReq.payload.email);
            expect(payload.password).to.not.exist();

            next(null);
          });

        }
      ], function(err) {
        done(err);
      });

    });

    lab.test('should fail if user tries to change email to one that is used by another user', function(done) {

      async.waterfall([
        // Create new user
        function(next) {
          var createUser = {
            method: "POST",
            url: "/user",
            payload: {
              firstName: "Second",
              lastName: "User",
              email: "blah@whammy.com",
              password: "hamsandwitch"
            }
          }
          server.inject(createUser, function(response) {
            var payload = JSON.parse(response.payload);

            expect(response.statusCode).to.equal(200);
            expect(payload.password).to.not.exist();
            expect(payload.firstName).to.be.string();
            expect(payload.lastName).to.string();
            expect(payload.email).to.string();

            next(null, payload);

          });
        },
        // Login user
        function(createdUser, next) {
          var loginReq = {
            method: "POST",
            url: "/login",
            payload: {
              email: createdUser.email,
              password: "hamsandwitch"
            }
          }

          server.inject(loginReq, function(response) {
            var payload = JSON.parse(response.payload);

            expect(response.statusCode).to.equal(200);
            expect(payload.token).to.be.string();

            loggedInUser = payload;

            next(null, payload);
          })
        },
        // Update user
        function(loggedInUser, next) {
          var updateUser = {
            method: "PUT",
            url: "/user",
            headers: {
              Authorization: 'Bearer ' + loggedInUser.token
            },
            payload: {
              email: "newemail@email.com",
            }
          }
          server.inject(updateUser, function(response) {
            var payload = JSON.parse(response.payload);

            expect(payload.errors.email).to.be.object();
            expect(payload.errors.email.message)
              .to.include("in use by another User");

            next(null, payload);

          });
        }
      ], function(err) {
        done(err);
      });

    });

  });

  lab.after(function(done) {
    server.plugins.mongoose.drop();
    server.plugins.mongoose.disconnect();
    done();
  });


});
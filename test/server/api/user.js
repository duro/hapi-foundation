var Lab         = require("lab")
  , Code        = require('code')
  , Composer    = require('../../../index')
  , UserPlugin  = require('../../../server/api/user')
  , AppConfig   = require('../../../config')
  , expect      = Code.expect
  , async       = require('async')
  , lab         = exports.lab = Lab.script();

var MongoosePlugin = {
  options: AppConfig.get('/database/mongodb'),
  register: require('../../../server/mongoose')
};

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
            url: "/user/" + payload.id,
            headers: {
              access_token: payload.token
            },
            payload: {
              firstName: "Your",
              lastName: "Mom",
              email: "newemail@email.com"
            }
          }

          server.inject(updateReq, function(response) {
            var payload = JSON.parse(response.payload);

            // console.log(response);

            expect(response.statusCode).to.equal(200);
            expect(payload.firstName).to.equal(options.payload.firstName);
            expect(payload.lastName).to.equal(options.payload.lastName);
            expect(payload.email).to.equal(options.payload.email);
            expect(payload.password).to.not.exist();

            next(null);
          });

        }
      ], function(err, result) {
        done(err);
      });

    });

    lab.test('should fail if no {id} provided', function(done) {
      var options = {
        method: "PUT",
        url: "/user/",
        payload: {
          firstName: "Your",
          lastName: "Mom"
        }
      }

      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(404);
        done();
      });

    });

    lab.test('should fail if user tries to change email to one that is used by another user', function(done) {

      async.waterfall([
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
            expect(payload.firstName).to.exist();
            expect(payload.lastName).to.exist();
            expect(payload.email).to.exist();

            next(null, payload);

          });
        },
        function(createdUser, next) {
          var updateUser = {
            method: "PUT",
            url: "/user/" + createdUser.id,
            payload: {
              email: "newemail@email.com",
            }
          }
          server.inject(updateUser, function(response) {
            var payload = JSON.parse(response.payload);

            expect(payload.errors.email).to.exist();
            expect(payload.errors.email.message)
              .to.include("in use by another User");

            next(null, payload);

          });
        }
      ], function(err, results) {
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
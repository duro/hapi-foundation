var Lab         = require("lab")
  , Code        = require('code') // Assertion library
  , lab         = exports.lab = Lab.script()
  , MockServer  = require('../mocks/server')
  , expect      = Code.expect;

lab.experiment("User", function() {

  var server = new MockServer()
    , newUser = {
        firstName: 'Adam',
        lastName: 'Test',
        email: 'adam@duromedia.com',
        password: 'whammmmy'
      }
    , existingUser;

  lab.before(function(done) {
    var deps = require('../../lib/plugins')(server);
    server.register(deps, done);
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

    lab.test('should be able to update first and last name', function(done) {
      var options = {
        method: "PUT",
        url: "/user/" + existingUser._id,
        payload: {
          firstName: "Your",
          lastName: "Mom"
        }
      }

      server.inject(options, function(response) {
        var payload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(payload.firstName).to.equal("Your");
        expect(payload.lastName).to.exist("Mom");
        expect(payload.password).to.not.exist();

        done();
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

  });

  lab.after(function(done) {
    server.plugins.mongoose.drop();
    server.plugins.mongoose.disconnect();
    done();
  });

});
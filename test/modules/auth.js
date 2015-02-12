var Lab         = require("lab")
  , Code        = require('code') // Assertion library
  , lab         = exports.lab = Lab.script()
  , MockServer  = require('../mocks/server')
  , expect      = Code.expect;

lab.experiment("Auth", function() {

  var server = new MockServer();

  var user = {
    firstName: 'Adam',
    lastName: 'Test',
    email: 'adam@duromedia.com',
    password: 'whammmmy'
  }

  lab.before(function(done) {
    var deps = require('../../lib/plugins')(server);
    server.register(deps, done);
  });

  lab.test("should create a new user", function(done) {
    var options = {
      method: "POST",
      url: "/register",
      payload: user
    };

    server.inject(options, function(response) {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);
      expect(payload.firstName).to.exist();
      expect(payload.lastName).to.exist();
      expect(payload.email).to.exist();

      done();
    });
  });

  lab.test("should fail creating a user with same email as existing user", function(done) {
    var options = {
      method: "POST",
      url: "/register",
      payload: user
    };

    server.inject(options, function(response) {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(400);

      done();
    });
  });

  lab.after(function(done) {
    server.plugins.mongoose.drop();
    server.plugins.mongoose.disconnect();
    done();
  });

});
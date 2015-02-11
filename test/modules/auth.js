var Lab         = require("lab")
  , Code        = require('code') // Assertion library
  , lab         = exports.lab = Lab.script()
  , MockServer  = require('../mocks/server')
  , expect      = Code.expect;

lab.experiment("Auth", function() {

  var server = new MockServer();

  lab.before(function(done) {
    var deps = require('../../lib/plugins')(server);
    server.register(deps, done);
  });

  lab.test("create a new user", function(done) {
    var options = {
      method: "POST",
      url: "/register",
      payload: {
        firstName: 'Adam',
        lastName: 'Test',
        email: 'adam@duromedia.com',
        password: 'whammmmy'
      }
    };

    server.inject(options, function(response) {
      var result = response.result;

      expect(response.statusCode).to.equal(200);
      // expect(response.result).to.include('hello world')

      done();
    });
  });

});
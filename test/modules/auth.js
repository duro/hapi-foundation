var Lab     = require("lab")
  , Code    = require('code') // Assertion library
  , lab     = exports.lab = Lab.script()
  , boot    = require("../../")
  , expect  = Code.expect
  , server;

lab.experiment("Auth", function() {

  lab.before(function(done) {
    boot.done(function(s) {
      server = s;
      done();
    })
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
var Lab     = require("lab")
  , Code    = require('code') // Assertion library
  , lab     = exports.lab = Lab.script()
  , boot  = require("../../")
  , expect  = Code.expect
  , server;

lab.experiment("Hello", function() {

  lab.before(function(done) {
    boot.done(function(s) {
      server = s;
      done();
    })
  });

  lab.test("returns 'hello world'", function(done) {
    var options = {
      method: "GET",
      url: "/hello"
    };

    server.inject(options, function(response) {
      var result = response.result;

      expect(response.statusCode).to.equal(200);
      expect(response.result).to.include('hello world')

      done();
    });
  });

});
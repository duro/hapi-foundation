var Lab     = require("lab")
  , Code    = require('code') // Assertion library
  , lab     = exports.lab = Lab.script()
  , server  = require("../../")
  , expect  = Code.expect;

lab.experiment("Hello", function() {

  lab.test("returns 'hello world'", function(done) {
    var options = {
      method: "GET",
      url: "/hello"
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.equal('hello world')

      done();
    });
  });

});
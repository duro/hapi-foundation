var Lab     = require("lab")
  , Code    = require('code') // Assertion library
  , lab     = exports.lab = Lab.script()
  , server  = require("../../")
  , expect  = Code.expect;

lab.experiment("Whammy", function() {

  lab.test("returns 'whammy'", function(done) {
    var options = {
      method: "GET",
      url: "/whammy"
    };

    server.inject(options, function(response) {
      var result = response.result;

      expect(response.statusCode).to.equal(200);
      expect(response.result).to.equal('whammy')

      done();
    });
  });

});
var Lab         = require('lab')
  , Code        = require('code')
  , lab         = exports.lab = Lab.script()
  , MockServer  = require('../mocks/server')
  , expect      = Code.expect;

lab.experiment("Hello", function() {

  var server = new MockServer();

  lab.before(function(done) {
    var deps = require('../../lib/plugins')(server);
    server.register(deps, done);
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

  lab.after(function(done) {
    server.plugins.mongoose.drop();
    server.plugins.mongoose.disconnect();
    done();
  });

});
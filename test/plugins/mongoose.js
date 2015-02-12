var Lab         = require("lab")
  , Code        = require('code') // Assertion library
  , lab         = exports.lab = Lab.script()
  , MockServer  = require('../mocks/server')
  , expect      = Code.expect;

lab.experiment("Mongoose Plugin", function() {

  var server = new MockServer();

  lab.before(function(done) {
    var deps = require('../../lib/plugins/mongoose')(server);
    server.register(deps, done);
  });

  lab.test("plugin should be loaded", function(done) {

    expect(server.plugins.mongoose).to.exist();
    done();

  });

  lab.after(function(done) {
    server.plugins.mongoose.drop();
    server.plugins.mongoose.disconnect();
    done();
  });

});
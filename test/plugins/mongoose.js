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

  lab.test("should be loaded", function(done) {
    var m = server.plugins.mongoose
    expect(m).to.exist();
    expect(m.mongoose).to.exist();
    done();

  });

  lab.test("should have created a connection", function(done) {
    var m = server.plugins.mongoose
    expect(m.mongoose.connections.length).to.be.at.least(1);
    expect(m.mongoose.connection.readyState).to.equal(1);
    done();

  });

  lab.after(function(done) {
    server.plugins.mongoose.drop();
    server.plugins.mongoose.disconnect();
    done();
  });

});
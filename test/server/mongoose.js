var Lab         = require("lab")
  , Code        = require('code') // Assertion library
  , MockServer  = require('../mocks/server')
  , AppConfig   = require('../../config')
  , expect      = Code.expect
  , lab         = exports.lab = Lab.script();

lab.experiment("Mongoose", function() {

  var server;

  lab.beforeEach(function(done) {
    server = new MockServer();
    done();
  });

  lab.test("should be loaded", function(done) {
    var plugins = {
      options: AppConfig.get('/database/mongodb'),
      register: require('../../server/mongoose')
    };
    server.register(plugins, function(err) {
      var m = server.plugins.mongoose;

      expect(err).to.not.exist();
      expect(m).to.exist();
      expect(m.mongoose).to.exist();

      server.plugins.mongoose.drop();
      server.plugins.mongoose.disconnect();

      done();
    });
  });

  lab.test("should have created a connection", function(done) {
    var plugins = {
      options: AppConfig.get('/database/mongodb'),
      register: require('../../server/mongoose')
    };
    server.register(plugins, function(err) {
      var m = server.plugins.mongoose

      expect(err).to.not.exist();
      expect(m.mongoose.connections.length).to.be.at.least(1);
      expect(m.mongoose.connection.readyState).to.equal(1);

      server.plugins.mongoose.drop();
      server.plugins.mongoose.disconnect();

      done();
    });

  });

  lab.test("should fail if no options passed", function(done) {
    var plugins = {
      register: require('../../server/mongoose')
    };
    server.register(plugins, function(err) {
      expect(err).to.be.object();
      done();
    });

  });

  lab.test("should fail if no hosts array passed", function(done) {
    var plugins = {
      options: {
        database: 'vt-api-test',
        hosts: []
      },
      register: require('../../server/mongoose')
    };
    server.register(plugins, function(err) {
      expect(err).to.be.object();
      done();
    });

  });

  lab.test("should fail if host object does not have a host or port field", function(done) {
    var plugins = {
      options: {
        database: 'vt-api-test',
        hosts: [{}]
      },
      register: require('../../server/mongoose')
    };
    server.register(plugins, function(err) {
      expect(err).to.be.object();
      done();
    });

  });

});
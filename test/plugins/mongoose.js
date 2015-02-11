var Lab     = require("lab")
  , Code    = require('code') // Assertion library
  , Hapi    = require('hapi')
  , lab     = exports.lab = Lab.script()
  , env     = process.env.NODE_ENV || 'dev'
  , config  = require('../../lib/config/' + env)
  , expect  = Code.expect;

lab.experiment("Mongoose Plugin", function() {

  var server = new Hapi.Server({
    app: config // Store static config
  });

  lab.test("should work", function(done) {

    server.register(
      require('../../lib/plugins/mongoose')(server),
      function(err) {
        expect(err).to.be.undefined();
        done();
      }
    );

  });

  lab.test("models loaded", function(done) {
    expect(server.plugins.mongoose.modelsLoaded()).to.be.true();
    done();

  });

});
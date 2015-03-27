var Lab         = require("lab")
  , Code        = require('code')
  , Composer    = require('../../../index')
  , AppConfig   = require('../../../config')
  , jwt         = require('jwt-simple')
  , expect      = Code.expect
  , lab         = exports.lab = Lab.script();

var user = {
  firstName: 'Tester',
  lastName: 'McGee',
  email: 'testy@mcgee.com',
  password: 'ilovetotestthings'
}

lab.experiment("Auth", function() {

  var server;

  lab.before(function(done) {
    Composer(function(err, composedServer) {
      server = composedServer;
      done(err);
    })
  });

  lab.test('should be able to create a authenticatable user', function(done) {
    var request = {
      method: "POST",
      url: "/user",
      payload: user
    }

    server.inject(request, function(response) {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);
      expect(payload.password).to.not.exist();
      expect(payload.firstName).to.exist();
      expect(payload.lastName).to.exist();
      expect(payload.email).to.exist();

      done();
    })
  });

  lab.test('should be able to login as that user', function(done) {
    var request = {
      method: "POST",
      url: "/login",
      payload: {
        email: user.email,
        password: user.password
      }
    }

    server.inject(request, function(response) {
      var payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);
      expect(payload.id).to.exist();
      expect(payload.password).to.not.exist();
      expect(payload.firstName).to.exist();
      expect(payload.lastName).to.exist();
      expect(payload.email).to.exist();
      expect(payload.token).to.exist();

      var decodedToken = jwt.decode(payload.token, AppConfig.get('/security/jwtSecret'));

      expect(decodedToken.userId).to.equal(payload.id);

      done();
    })
  });

  lab.test('should fail if no user can be found', function(done) {
    var request = {
      method: "POST",
      url: "/login",
      payload: {
        email: "nonexistant@user.com",
        password: "doesntmatter"
      }
    }

    server.inject(request, function(response) {

      expect(response.statusCode).to.equal(401);

      done();
    })
  });

  lab.test('should fail if wrong password used', function(done) {
    var request = {
      method: "POST",
      url: "/login",
      payload: {
        email: user.email,
        password: "doesntmatter"
      }
    }

    server.inject(request, function(response) {

      expect(response.statusCode).to.equal(401);

      done();
    })
  });

  lab.after(function(done) {
    server.plugins.mongoose.drop();
    server.plugins.mongoose.disconnect();
    done();
  });

});
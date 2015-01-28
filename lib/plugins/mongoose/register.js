var mongoose  = require('mongoose')
  , mongoUri  = require('mongodb-uri')
  , Hoek      = require('hoek')
  , _         = require('lodash');

module.exports.register = function(server, options, done) {

  var uri, defaults;

  defaults = {
    hosts: null,
    database: null
  }

  if (options == null) options = {};

  options = Hoek.applyToDefaults(defaults, options);

  Hoek.assert(
    options.hosts && _.isArray(options.hosts),
    'You must supply a hosts array for your mongo connection'
  );

  Hoek.assert(
    options.hosts.length > 0 && options.hosts[0].host && options.hosts[0].port,
    'Your hosts array must contain at least one host object. ' +
    'Example: {host: "127.0.0.1", port: 27017}'
  );

  Hoek.assert(options.database, 'You must supply a database for your mongo connection');

  uri = mongoUri.format(options);
  server.log(['plugin', 'info'], "Mongoose connecting to " + uri);

  function startDb(cb) {
    mongoose.connect(uri, function(err) {
      if (err) {
        server.log(['plugin', 'error', 'fatal'], "Mongoose connection failure");
        return cb(err);
      }
      else {
        server.log(['plugin', 'info'], "Mongoose connected to " + uri);
        return cb();
      }
    });
  }

  function stopDb() {
    return mongoose.disconnect();
  }

  startDb(done);
  server.expose('mongoose', mongoose);
  server.expose('start', startDb);
  server.expose('stop', stopDb);
}

module.exports.register.attributes = {
  name: 'mongoose',
  version: '1.0.0'
}

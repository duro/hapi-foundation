var Promise   = require('bluebird')
  , mongoose  = require('mongoose')
  , mongoUri  = require('mongodb-uri')
  , Hoek      = require('hoek')
  , _         = require('lodash');

Promise.promisifyAll(mongoose);

exports.register = function (server, options, next) {

  var uri, defaults;

  defaults = {
    hosts: null,
    database: null
  }

  options = Hoek.applyToDefaults(defaults, options);

  try {
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
  }
  catch(err) {
    return next(err);
  }

  server.expose('mongoose', mongoose);
  server.expose('connect', startDb);
  server.expose('disconnect', stopDb);
  server.expose('drop', dropDb);

  uri = mongoUri.format(options);

  function startDb(cb) {
    if (mongoose.connection.readyState === 0) {
      server.log(['plugin', 'info'], "Mongoose connecting to " + uri);
      mongoose.connect(uri, function(err) {
        if (err) {
          server.log(['plugin', 'error', 'fatal'], "Mongoose connection failure");
          return cb(err);
        }
        else {
          server.log(['plugin', 'info'], "Mongoose connected to " + uri);
          cb();
        }
      });
    } else {
      server.log(['plugin', 'info'], "Mongoose already connected");
      cb();
    }
  }

  function stopDb() {
    return mongoose.disconnect();
  }

  function dropDb() {
    if (process.env.NODE_ENV === 'test') {
      mongoose.connection.db.dropDatabase();
    } else {
      console.log('This can only be done when in testing');
    }
  }

  startDb(next);
}

exports.register.attributes = {
  name: 'mongoose'
}
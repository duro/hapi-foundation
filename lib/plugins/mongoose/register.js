var mongoose  = require('mongoose')
  , mongoUri  = require('mongodb-uri')
  , Hoek      = require('hoek')
  , glob      = require('glob')
  , _         = require('lodash');

var modelsLoaded = false;

module.exports.register = function(server, options, next) {

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

  server.expose('mongoose', mongoose);
  server.expose('start', startDb);
  server.expose('stop', stopDb);
  server.expose('modelsLoaded', function() { return modelsLoaded; });

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

  function loadModels() {
    if (!modelsLoaded) {
      var models = glob.sync('lib/modules/**/models/*.js');
      models.forEach(function(name) {
        var model           = require('../../../' + name)
          , collectionName  = model.collection || null
          , modelName       = model.name || _.str.camelize(name.slice(0,name.indexOf('.')));
        mongoose.model(modelName, model.schema, collectionName);
        server.log(['plugin', 'info'], 'Model Loaded: ' + modelName);
      });
      modelsLoaded = true;
    } else {
    }
  }

  loadModels();
  startDb(next);
}

module.exports.register.attributes = {
  name: 'mongoose',
  version: '1.0.0'
}

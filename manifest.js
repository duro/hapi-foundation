var Confidence = require('confidence');
var AppConfig = require('./config');


var criteria = {
  env: process.env.NODE_ENV
};


var manifest = {
  $meta: 'Our main server manifest',
  server: {},
  connections: [{
    host: AppConfig.get('/server/host'),
    port: AppConfig.get('/server/port')
  }],
  plugins: {
    'good': {
      opsInterval: 1000,
      reporters: [{
        reporter: require('good-console'),
        args: {
          $filter: 'env',
          test: [],
          $default: [{ log: '*', response: '*' }]
        }
      }]
    },
    './server/mongoose': AppConfig.get('/database/mongodb'),
    'hapi-swagger': {
      basePath: AppConfig.get('/api/basepath'),
      apiVersion: AppConfig.get('/pkg/version')
    },
    'hapi-auth-bearer-token': {},
    './server/api/hello': {},
    './server/api/auth': {},
    './server/api/user': {},
    './server/api/event': {}
  }
};


var store = new Confidence.Store(manifest);


exports.get = function (key) {

  return store.get(key, criteria);
};


exports.meta = function (key) {

  return store.meta(key, criteria);
};
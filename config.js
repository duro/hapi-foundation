var Confidence = require('confidence');

var criteria = {
    env: process.env.NODE_ENV
};

var config = {

  $meta: 'Our main Application config',

  pkg: require('./package.json'),

  server : {
    port : '8000',
    host : '0.0.0.0'
  },

  api: {
    basepath: 'http://docker.local:8000',
    title: 'VT-API',
    description: 'The official API for the VT platform.'
  },

  security: {
    jwtSecret: '=yh$LqTBHwff*wRTxhQ{XJX4/v{9'
  },

  logging : {
    enabled: {
      $filter: 'env',
      test: false,
      $default: true
    },
    reporters : [{
      reporter: require('good-console'),
      args:[{ log: '*', response: '*' }]
    }]
  },

  database: {
    mongodb: {
      database: {
        $filter: 'env',
        test: 'vt-api-test',
        $default: 'vt-api'
      },
      hosts: [
        {
          host: process.env.MONGODB_PORT_27017_TCP_ADDR,
          port: process.env.MONGODB_PORT_27017_TCP_PORT,
        }
      ]
    }
  }

}

var store = new Confidence.Store(config);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
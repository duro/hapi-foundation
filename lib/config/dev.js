var _     = require('lodash')
  , Hoek  = require('hoek')
  , all   = require('./all.js');

module.exports = Hoek.applyToDefaults(all, {

  api: {
    basepath: 'http://docker.local:8000'
  },

  database: {
    mongodb: {
      // See https://github.com/mongolab/mongodb-uri-node#format for options
      database: 'vt-api',
      hosts: [
        {
          host: process.env.MONGODB_PORT_27017_TCP_ADDR,
          port: process.env.MONGODB_PORT_27017_TCP_PORT,
        }
      ]
    }
  }

});
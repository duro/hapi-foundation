var _ = require('lodash');

module.exports = _.extend(require('./all.js'), {

  database: {
    mongodb: {
      // See https://github.com/mongolab/mongodb-uri-node#format for options
      hosts: [
        {
          host: process.env.MONGODB_PORT_27017_TCP_ADDR,
          port: process.env.MONGODB_PORT_27017_TCP_PORT,
        }
      ],
      database: 'vt-api',
    }
  }

});
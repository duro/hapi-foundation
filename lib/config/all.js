module.exports = {

  pkg: require('../../package.json'),

  server : {
    port : '8000',
    host : '0.0.0.0'
  },

  logging : {
    path : '/var/log/vt-api/vt-api.log'
  },

  database: {},

  modules : [ 'auth', 'hello' ]

}
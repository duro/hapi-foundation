module.exports = {

  pkg: require('../../package.json'),

  server : {
    port : '8000',
    host : '0.0.0.0'
  },

  logging : {
    enabled: true,
    reporters : [{
        reporter: require('good-console'),
        args:[{ log: '*', response: '*' }]
      }
      // , {
      //   reporter: require('good-file'),
      //   args: ['/var/log/vt-api/vt-api.log', { ops: '*' }]
      // }
    ]
  },

  database: {},

  modules : [ 'hello','auth' ]

}
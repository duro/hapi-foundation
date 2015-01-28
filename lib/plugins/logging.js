module.exports = {
  register: require('good'),
  options: options = {
    opsInterval: 1000,
    reporters: [{
      reporter: require('good-console'),
      args:[{ log: '*', response: '*' }]
    }
    // , {
    //   reporter: require('good-file'),
    //   args: ['/var/log/vt-api/vt-api.log', { ops: '*' }]
    // }
    ]
  }
};
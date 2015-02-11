var _     = require('lodash')
  , Hoek  = require('hoek');

module.exports = Hoek.applyToDefaults(require('./dev.js'), {

  logging : {
    enabled: false
  }

});
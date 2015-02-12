var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema;

var schemaUser = new Schema({
  firstName         : {type: String, required: true},
  lastName          : {type: String, required: true},
  email             : {type: String, required: true, index: {unique: true}},
  password          : {type: String, protect: true}
});

schemaUser.plugin( require('../../common/models/plugins/timestamp') );
schemaUser.plugin( require('mongoose-mass-assign') );

module.exports = mongoose.model('User', schemaUser, 'User');
var mongoose        = require('mongoose')
  , Schema          = mongoose.Schema
  , User;

var schema = new Schema({
  firstName : {type: String, required: true},
  lastName  : {type: String, required: true},
  email     : {
                type: String,
                validate: [
                  /* Validator: */ checkForDuplicate,
                  /* Message: */ 'The email that was provided is in use by another User',
                ],
                required: true,
                index: {unique: true}
              },
  password  : {type: String}
});

schema.plugin( require('../../common/models/plugins/timestamp') );
schema.plugin( require('mongoose-mass-assign') );

if (!schema.options.toObject) schema.options.toJSON = {};
schema.options.toJSON.transform = function(doc, ret, options) {
  if (options.hide) {
    options.hide.split(' ').forEach(function (prop) {
      delete ret[prop];
    });
  }
}

function checkForDuplicate(value, respond) {
  var query = User.where({email: value});

  if (!this.isNew) {
    query.ne("_id", this._id);
  }

  query.count(function(err, count) {
    if (err) return respond(err);
    // If count is not 0, we have a problem
    respond((count === 0));
  });
}

module.exports = User = mongoose.model('User', schema, 'User');
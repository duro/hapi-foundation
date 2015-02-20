// Deopendencies
var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , Promise   = require('bluebird')
  , bcrypt    = require('bcrypt')
  , jwt       = require('jwt-simple')
  , AppConfig = require('../../../../config')
  , User;

// Constants
var SALT_WORK_FACTOR = 10;

// Promisify our bcrypt module
Promise.promisifyAll(bcrypt);

//////////////////////
// Field Schema
/////

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
  password  : {type: String},
  temporaryPassword : {type: String}
});

////////////////
// Plugins
/////

schema.plugin( require('../../common/models/plugins/timestamp') );
schema.plugin( require('mongoose-mass-assign') );

//////////////////////
// Schema Options
/////

// JSON Serialization Transform
schema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret, options) {
    // Delete password on serialization
    delete ret.password;
    delete ret.temporaryPassword;

    // Also allow manual hiding of fields
    // Example user.toJSON({hide: 'field1 field2', transform: true});
    if (options.hide) {
      options.hide.split(' ').forEach(function (prop) {
        delete ret[prop];
      });
    }
  }
});

////////////////////////////
// Pre-save Middleware
/////

// Password hash
schema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

          // reset the temporary password and
          // override the cleartext password with the hashed one
          user.temporaryPassword = "";
          user.password = hash;
          next();
        });
    });
});

////////////////////
// Validators
/////

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

/////////////////////////
// Instance Methods
/////

/*
method to verify password
 */
schema.methods.comparePassword = function(candidatePassword) {
  var user = this;

  return bcrypt.compareAsync(candidatePassword, this.password || '')
    .then(function(isMatch) {
      return { match: isMatch }
    });

  // bcrypt.compare(candidatePassword, this.password || '', function(err, isMatch) {
  //     if (err) return cb(err);
  //     if (isMatch) {
  //       cb(null, { match: true});
  //     } else {
  //       cb()
  //     }
  // });
};

/*
custom instance method to generate token using
jwt-simple nodejs module (https://github.com/hokaccha/node-jwt-simple)
 */
schema.methods.generateToken = function() {
  var payload = { userId: this.id };
  var token = jwt.encode(payload, AppConfig.get('/security/jwtSecret'));
  return token;
}

module.exports = User = mongoose.model('User', schema, 'User');
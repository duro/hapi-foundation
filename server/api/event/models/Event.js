// Dependencies
var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , Event;

//////////////////////
// Field Schema
/////

var schema = new Schema({
  _owner      : {type: Schema.Types.ObjectId, index: true, required: true},
  title       : {type: String, required: true},
  dateTime    : {type: Date, required: true},
  description : String,
  invited     : [String],
  heroImage   : String
});

////////////////
// Plugins
/////

schema.plugin( require('../../common/models/plugins/timestamp') );
schema.plugin( require('mongoose-mass-assign') );

module.exports = Event = mongoose.model('Event', schema, 'Event');
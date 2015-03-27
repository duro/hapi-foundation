// timestamp.js
exports = module.exports = function timestampPlugin (schema) {
  schema.add({ created: {type: Date, required: true} });

  schema.add({ modified: {type: Date, required: true} });

  schema.pre('validate', function (next) {
    if (!this.created)  this.created = new Date();
    this.modified  = new Date();
    next();
  });

}
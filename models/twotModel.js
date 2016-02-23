var mongoose = require('mongoose');

// Create a Schema
var twotSchema = mongoose.Schema({
  username: String,
  twot: String
});

module.exports = mongoose.model("Twots", twotSchema);
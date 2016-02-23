var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

// Create a Schema
var userSchema = mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("Users", userSchema);
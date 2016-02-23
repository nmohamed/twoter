require('./../../../app'); // to connect to the database
var expect = require('chai').expect;
var User = require('./../../../models/userModel');

describe('user Model', function() {
  it('should create a new user', function(done) {
    var user = new User({
      username: 'Person',
      password: 'passwd'
    });
    user.save(function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  // What else can you test?

  it('should remove a twot by username', function(done) {
    User.remove({ username: 'Person' }, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });
});

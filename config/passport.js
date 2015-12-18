var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
//var configAuth = require('./auth');


passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if(err) { return next(err); }
			
			if(!user) {
				return done(null, false, { message: 'Incorrect Username.'});
			}
			if(!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect Password.'});
			}
			return done(null, user);
		});
	}
));

module.exports = passport;
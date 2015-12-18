var express = require('express');
var router = express.Router();

var passport = require('passport');
var jwt = require('express-jwt');

var mongoose = require('mongoose');
var User = mongoose.model('user');

//913900382000498 8dfe13515ce420dba5490fceaa7c8318 localhost
var FACEBOOK_APP_ID = "913900382000498"
var FACEBOOK_APP_SECRET = "8dfe13515ce420dba5490fceaa7c8318";


var auth = jwt({secret: 'shhh', userProperty: 'payload'});



router.post('/register', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Please fill out all fields.'});
	}
	
	var user = new User();
	
	user.name = req.body.username;
	user.username = req.body.username;
	user.password = req.body.password;
	
	user.setPassword(req.body.password);
	
	console.log('done3');
	user.save(function(err) {
		if(err) {return next(err);}
		
		return res.json({token: user.generateJWT()});
	});
});

router.post('/login', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Please fill out all fields.'});
	}
	
	passport.authenticate('local', function(err, user, info) {
		if(err) {return next(err);}
		
		if(user){
			return res.json({token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		}
	})(req,res,next);
});

router.post('/fbauth', function(req, res, next) {
	var postUser = req.body;
	console.log("asdf");
	if(!postUser.facebook.id) {
		return res.status(400).json({message: 'Facebook id unattainable :o'});
	}
	console.log("asdf2");
	
	 User.findOrCreate({ "facebook.id" : postUser.facebook.id}, postUser, function(err, user) {
		if(err) { return next(err);}

	console.log("asdf3");
		if(!user) {
			var newUser            = new User();

	console.log("asd5f");
			newUser.name = postUser.facebook.name;
			
			newUser.fbid    = postUser.facebook.id; 
			newUser.facebook.id    = postUser.facebook.id; 
			newUser.facebook.name  = postUser.facebook.name; 
			newUser.facebook.email = postUser.facebook.email;
						
			// save our user to the database
			newUser.save(function(err) {
				if (err)
					throw err;

				// if successful, return the new user
				//return res.json({token: newUser.generateJWT()});
			}).success(function(){
				return res.json({token: newUser.generateJWT()});
 
		   });

			
		}
		return res.json({token: user.generateJWT()});
		
	 });
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

router.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
	
  });

router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res, next) {
	
	if(req.user) {	
		res.send({token :req.user.generateJWT()});
		//res.redirect('/fbauth?id='+req.user._id);
	}

	res.location('/#/login');
	next();
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;

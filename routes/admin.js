var express = require('express');
var router = express.Router();

// data inject object
var datainject = require('../datainject.js');

// models dependencies
var MODEL_URL = '../models/';
var mongoose = require('mongoose');
//require('../app/model/temp/Comments');
//require('../app/model/temp/Posts');
require(MODEL_URL + 'company');
require(MODEL_URL + 'advertiser');
require(MODEL_URL + 'cheese');
require(MODEL_URL + 'user');
//require('../app/model/temp/Posts');

//var Comment = mongoose.model('Comment');
//var Post = mongoose.model('Post');
var Company = mongoose.model('company');
var Advertiser = mongoose.model('advertiser');
var Cheese = mongoose.model('cheese');
var User = mongoose.model('user');
//var Post = mongoose.model('Post');

/* GET home page. */
router.get('/loadthedata', function(req, res, next) {
	var user = new User();
	user.setPassword("janan");
	user.username = "janan";
	user.name = "Janan";
	user.email = "janan@gmail.com";
	user.save();
	
	var coy = new Company(datainject.company);
	var adv = new Advertiser(datainject.advertiser);
	adv.company = coy._id;
	
	coy.save();
	adv.save();
	
	var bulk = Cheese.collection.initializeOrderedBulkOp();

	var che = datainject.cheese;
	che.forEach(function(chee){
		chee.advertiser = adv._id;
		chee.creator = user._id;
		bulk.insert(chee);
	});
	
	bulk.execute(function(err,result) {
           // maybe do something with result
    });
	
	
	/*
	Cheese.collection.insert(cheeses, function(err) {
		if(err) {return next(err);}
	});
*/
	
	
	/*
	var coy = new Company(datainject.company);
	coy.save(function(err) {
		if(err) {return next(err);}
		
		
		var adv = new Advertiser(datainject.advertiser);
		adv.company = coy._id;
		adv.save(function(err) {
			if(err) {return next(err);}

			
			
			var che = datainject.cheese;
			var cheeses = [];
			che.forEach(function(chee){
				var tempChee = new Cheese(chee);
				tempChee.advertiser = adv._id;
				cheeses.push(tempChee);
				
			});
			
			Cheese.collection.insert(cheeses, function(err) {
				if(err) {return next(err);}
			});
			
			
			Cheese.collection.insert(che, function(err) {
				if(err) {return next(err);}
			});
		});
	});
	
	
	*/
	
	
	res.redirect('/');
});



module.exports = router;

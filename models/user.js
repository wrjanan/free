var restful	   = require('node-restful');
var findOrCreate = require('mongoose-findorcreate');
var mongoose   = restful.mongoose; // for working w/ our database

// Only load the email type
var mongooseTypes = require("mongoose-types");
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var UserSchema = new mongoose.Schema({
	agreementdate : Date,
	birthdate : Date,
	creationdate : { type: Date , default: new Date() },
	lastlogindate : { type: Date , default: new Date() },
	activated : Number,
	age : Number,
	credit : Number,
	gender : Number,
	email : String,
	address : String,
	name : String,
	occupation : String,
	username	:	
		{
			type	:	String,
			lowercase	:	true,
			unique	:	true
		},
	hash	:	String,
	salt	:	String,
	password : String,
	paypalemail : String,
	searchqueries : [{ 
		querydate : { type: Date , default: Date.now },
		status : Number,
		query : String,
	}],
	fbid	:	String,
	facebook : {
		id	:	String,
		token	:	String,
		name	:	String,
		email	:	String,
	}
  });


UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	// pbkdf2Sync(password, salt, iterations, key length)
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	
	return this.hash === hash;
}

UserSchema.methods.generateJWT = function() {
	
	//set expiration to 60 days
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60);
	
	return jwt.sign({
		user		:	this,
		exp			:	parseInt(exp.getTime() / 1000)
		
	}, 'sqkiilovesyou');
}


UserSchema.plugin(findOrCreate);

var User = restful.model('user', UserSchema).methods(['get', 'post', 'put', 'delete']);


User.route('searchquery.get', {
    detail: true,
    handler: function(req, res, next) {
        // req.params.id holds the resource's id
		User.findById({_id:req.params.id},{ searchqueries: 1, _id:0 }, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);	
			});
	}
});

User.route('searchquery.post', {
    detail: true,
    handler: function(req, res, next) {
		// req.params.id holds the resource's id
		User.findById(req.params.id, 'searchqueries', function (err, user) {
		  if (!err) {
			user.searchqueries.push(
						{ 
							query : req.body.query, 
							status : req.body.status
						});
			user.save();
			res.json("Search query added~");
			  //res.end - immediate cut no reply, save connections.
		  }
		});
	}
});

module.exports = User;
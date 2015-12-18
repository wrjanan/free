var restful	   = require('node-restful');
var mongoose   = restful.mongoose; // for working w/ our database

// Only load the email type
var mongooseTypes = require("mongoose-types");
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;

var options = {
	timestamps: { createdAt: 'createdate' }
};

var AdvertiserSchema = new mongoose.Schema({
	lastlogin		:	{ type: Date , default: Date.now },
	credit : Number,
	company : { type: mongoose.Schema.Types.ObjectId, ref : 'company'},
	activated : Number,
	password : String,
	name : String,
	email : Email,
	paypalemail : Email,
	notifications : Number
  });



var Advertiser = restful.model('advertiser', AdvertiserSchema)
.methods(['get', 'post', 'put', 'delete']);


module.exports = Advertiser;
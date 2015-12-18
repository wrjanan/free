var restful	   = require('node-restful');
var mongoose   = restful.mongoose; // for working w/ our database

// Only load the email type
var mongooseTypes = require("mongoose-types");
mongooseTypes.loadTypes(mongoose, "email");
mongooseTypes.loadTypes(mongoose, "url");
var Email = mongoose.SchemaTypes.Email;
var Url = mongoose.SchemaTypes.Url;

var options = {
	timestamps: { createdAt: 'createdate' },
	
};

var SqkiiTags = ['sqkii', 'janan', 'food', 'restaurant', 'clothes'];

var CheeseSchema = new mongoose.Schema({
	date : {
		end : { type: Date , default: Date.now },
		start : { type: Date , default: Date.now },
		create : { type: Date , default: Date.now }
	},
	advertiser : { type: mongoose.Schema.Types.ObjectId, ref : 'advertiser'},
	creator : { type: mongoose.Schema.Types.ObjectId, ref : 'user'},
	likes: [{type: mongoose.Schema.Types.ObjectId, ref : 'user'}],
	boughtimpre : Number,
	discover : Number,
	numimpre : Number,
	numviewed : Number,
	remainingimpre : Number,
	status : Number,
	description : String,
	descriptionaddress : String,
	descriptiondetails : String,
	descriptioncompany : String,
	imageurl : Url,
	link : Url,
	linklabel : Url,
	thumburl : Url,
	title : String,
	targetgender : { type: String, enum: ['male', 'female', 'both']},
	targetmaxage : {type: Number, default: 100},
	targetminage : {type: Number, default: 0},
	upvotes: {type: Number, default: 0},
	tags : [{type:String, enum: SqkiiTags}],
	userTags : [{type:String}],
	comments : [{
		comment:String,
		username:String,
		user:{type: mongoose.Schema.Types.ObjectId, ref : 'user'},
		createdAt:{ type: Date , default: Date.now }
	}],
	validates : [{
		comment:String,
		username:String,
		user:{type: mongoose.Schema.Types.ObjectId, ref : 'user'},
		validatedAt:{ type: Date , default: Date.now },
		createdAt:{ type: Date , default: Date.now }
	}],
	views : [{
		secondsviewed : Number,
		username:String,
		user:{type: mongoose.Schema.Types.ObjectId, ref : 'user'},
		createdAt:{ type: Date , default: Date.now }
	}],
	viewReward : [{
		creditreward:Number,
		user:{type: mongoose.Schema.Types.ObjectId, ref : 'user'},
		createdAt:{ type: Date , default: Date.now }
	}]
  });

CheeseSchema.methods.upvote = function(cb) {
  	this.upvotes += 1;
  	this.save(cb);
};

CheeseSchema.methods.pushcomment = function(cb) {
  	this.comments.push(cb);
  	this.save(cb);
};

CheeseSchema.virtual('date.left').get(function () {
	var milliseconds = this.date.end - Date.now();
	
	
  	return (milliseconds);
});

CheeseSchema.virtual('validatedUsers').get(function () {
	var users = [];
	if(this.validates){
		users.push(this.creator);
		for(i = 0; i < this.validates.length; i++) {
			users.push(this.validates[i].user);
		}
	}
	
	return users;
});

CheeseSchema.set('toJSON', { virtuals : true });

var Cheese = restful.model('cheese', CheeseSchema)
.methods(['get', 'post', 'put', 'delete']);

module.exports = Cheese;
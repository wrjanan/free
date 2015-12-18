var restful	   = require('node-restful');
var mongoose   = restful.mongoose; // for working w/ our database

var CheeseShareSchema = new mongoose.Schema({
	createdAt :  { type: Date , default: Date.now },
	cheese : { type: mongoose.Schema.Types.ObjectId, ref : 'cheese'},
	sharer : { type: mongoose.Schema.Types.ObjectId, ref : 'user'}
  });


var CheeseShare = restful.model('cheeseshare', CheeseShareSchema)
.methods(['get', 'post']);

module.exports = CheeseShare;
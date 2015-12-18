var restful	   = require('node-restful');
var mongoose   = restful.mongoose; // for working w/ our database

var CheeseLikeSchema = new mongoose.Schema({
	createdAt :  { type: Date , default: Date.now },
	cheese : { type: mongoose.Schema.Types.ObjectId, ref : 'cheese'},
	liker : { type: mongoose.Schema.Types.ObjectId, ref : 'user'}
  });


var CheeseLike = restful.model('cheeselike', CheeseLikeSchema)
.methods(['get', 'post']);

module.exports = CheeseLike;
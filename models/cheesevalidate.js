var restful	   = require('node-restful');
var mongoose   = restful.mongoose; // for working w/ our database

var CheeseVaildateSchema = new mongoose.Schema({
	comment: String,
	createdAt :  { type: Date , default: Date.now },
	validatedAt :  { type: Date , default: Date.now },
	cheese : { type: mongoose.Schema.Types.ObjectId, ref : 'cheese'},
	validator : { type: mongoose.Schema.Types.ObjectId, ref : 'user'}
  });


var CheeseValidate = restful.model('cheesevalidate', CheeseVaildateSchema)
.methods(['get', 'post', 'delete']);

module.exports = CheeseValidate;
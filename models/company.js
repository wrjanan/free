var restful	   = require('node-restful');
var mongoose   = restful.mongoose; // for working w/ our database

// Only load the email type
var mongooseTypes = require("mongoose-types");
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;

var options = {
	timestamps: { createdAt: 'createdate' }
};

var CompanySchema = new mongoose.Schema({
	creationdate : { type: Date , default: Date.now },
	address : String,
	email : Email,
	name : String,
	phone : String,
	loc	:	{
		type: [Number], // [<longitude>,<latitude>]
		index: '2d'
	}
  });


var Company = restful.model('company', CompanySchema)
  .methods(['get', 'post', 'put', 'delete']);


module.exports = Company;
// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express    = require('express'); // call express
var bodyParser = require('body-parser'); // get body-parser
var cookieParser = require("cookie-parser");
var morgan     = require('morgan'); // used to see requests
var methodOverride = require('method-override');

var restful	   = require('node-restful');
var mongoose   = restful.mongoose; // for working w/ our database
var config		= require('./config/config'); // config data

// new tests

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var passport = require('passport');

// routes
var admin = require('./routes/admin.js');
//var cheese = require('./routes/cheese');
var index = require('./routes/index.js');

//require('./app/model/temp/Comments');
//require('./app/model/temp/Posts');
//require('./models/Users');
require('./config/passport');

// new tests 
var app        = express(); // define our app using express

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// APP CONFIGURATION ---------------------
// use body parser so we can grab information from POST requests
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/favicon.ico'));
app.use(methodOverride());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// log all requests to the console 
//app.use(morgan('dev'));

// connect to database
mongoose.connect(config.database.url); 


app.use(passport.initialize());

// Set /routes/<file>.js to desired api points
app.use('/', index);
//app.use('/', cheese);
app.use('/admin', admin);



// ROUTES FOR OUR API
// loads our sqkii schemas with node-restful, virtual methods & detailed api pulls. 
// view within individual schema /models/<file>.js to see more.
// =============================

// basic route for the home page
app.get('/', function(req, res) {
	res.render('index', { title: 'Sqkii' });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// These restful route services will overwrite the basic restful services generated from node-restful
//var apiRouter = require('./app/route/apiRouter')(app, express);
//app.use('/', apiRouter);
var restFolder = './models/';
var pathPrefix = '/api';


// GENERAL SETUP FOR SCHEMAS TO NODE-RESTFUL --------
// Basic schema implementation of node-restful



var Advertiser = require(restFolder.concat('advertiser.js'));
Advertiser.register(app, pathPrefix + '/advertiser');

var Cheese = require(restFolder.concat('cheese.js'));
Cheese.register(app, pathPrefix + '/cheese');

var CheeseLike = require(restFolder.concat('cheeselike.js'));
CheeseLike.register(app, pathPrefix + '/cheeselike');

var CheeseShare = require(restFolder.concat('cheeseshare.js'));
CheeseShare.register(app, pathPrefix + '/cheeseshare');

var CheeseValidate = require(restFolder.concat('cheesevalidate.js'));
CheeseValidate.register(app, pathPrefix + '/cheesevalidate');

var Company = require(restFolder.concat('company.js'));
Company.register(app, pathPrefix + '/company');

var User = require(restFolder.concat('user.js'));
User.register(app, pathPrefix + '/user');

//var Post = require(restFolder.concat('temp/Posts.js'));
//Post.register(app, pathPrefix + '/post');

//var Comment = require(restFolder.concat('temp/Comments.js'));
//Comment.register(app, pathPrefix + '/comment');
/*

var Agreement = require(restFolder.concat('agreement.js'));
Agreement.register(app, pathPrefix + '/agreement');

var Cashout = require(restFolder.concat('cashout.js'));
Cashout.register(app, pathPrefix + '/cashout');

var Category = require(restFolder.concat('category.js'));
Category.register(app, pathPrefix + '/category');

var Faq = require(restFolder.concat('faq.js'));
Faq.register(app, pathPrefix + '/faq');

var Faqsection = require(restFolder.concat('faqsection.js'));
Faqsection.register(app, pathPrefix + '/faqsection');

var Favourite = require(restFolder.concat('favourite.js'));
Favourite.register(app, pathPrefix + '/favourite');

var Global = require(restFolder.concat('global.js'));
Global.register(app, pathPrefix + '/global');

var Invitationcode = require(restFolder.concat('invitationcode.js'));
Invitationcode.register(app, pathPrefix + '/invitationcode');

var Luckybox = require(restFolder.concat('luckybox.js'));
Luckybox.register(app, pathPrefix + '/luckybox');

var Luckyboxredemption = require(restFolder.concat('luckyboxredemption.js'));
Luckyboxredemption.register(app, pathPrefix + '/luckyboxredemption');

var Message = require(restFolder.concat('message.js'));
Message.register(app, pathPrefix + '/message');

var Referral = require(restFolder.concat('referral.js'));
Referral.register(app, pathPrefix + '/referral');

var Revisit = require(restFolder.concat('revisit.js'));
Revisit.register(app, pathPrefix + '/revisit');

var Searchquery = require(restFolder.concat('searchquery.js'));
Searchquery.register(app, pathPrefix + '/searchquery');

var Share = require(restFolder.concat('share.js'));
Share.register(app, pathPrefix + '/share');

var Squib = require(restFolder.concat('squib.js'));
Squib.register(app, pathPrefix + '/squib');

var Squibcategory = require(restFolder.concat('squibcategory.js'));
Squibcategory.register(app, pathPrefix + '/squibcategory');

var Squibedit = require(restFolder.concat('squibedit.js'));
Squibedit.register(app, pathPrefix + '/squibedit');

var Squiblocation = require(restFolder.concat('squiblocation.js'));
Squiblocation.register(app, pathPrefix + '/squiblocation');

var Squibview = require(restFolder.concat('squibview.js'));
Squibview.register(app, pathPrefix + '/squibview');

*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
// START THE SERVER
// ===============================
module.exports = app;
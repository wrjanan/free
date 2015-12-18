Welcome to Sqkii's main app! 
We will like to first and foremost thank all the efforts of those whom have contributed to online resources, to allow less technical developers to not waste man hours reinventing the wheel. To the people at Sqkii, we feel that there is a unique sense of altruism for those who share when they can. We look forward to joining them with the right mindset and abilities to give back when we can, even though compassion is underrated. 

So, we are on MEAN stack, speed is important to us, as for time. We are hoping to embrace a full javascript stack to both speedily push updates and allow for a seamless experience for our fellow users.

File Structure
- bin
	- www : the initial boot up script for the app
- config
	- auth.js : authentication settings (fb login, passport.js)
	- config.js : general configuration file
	- passport.js : passport.js strategies
- models
	- *.js : model schema, virtual methods, api endpoints in individual files.
- node_modules
	- angular-facebook : ezfb, facebook api dependency for angular
	- bcrypt-nodejs : password hashing
	- body-parser : simple form parser *require others for image files
	- cookie-parser : not for cookie monster, for our browser
	- debug : debugging *yet to implement extensively
	- ejs : not html, ejs. html's younger more fluid brother
	- express : speeding up app routing and development
	- express-jwt : json web tokens, our login session
	- express-session : session objects
	- method-override : override http verbs
	- mongoose : mongodb Object Data Manager 
	- mongoose-findorcreate : find or create method 
	- mongoose-types : Email, URL, etc.
	- morgan : logger middleware
	- node-restful : dynamic restful api creation
	- passport : authentication module
	- passport-facebook : facebook strategy
	- passport-local : local cache strategy
	- serve-favicon : favicon serving middleware with caching
- public
	- images
	- javascripts
		- angularApp.js : client side angular logic
	- stylesheets
- routes
	- admin.js : admin module /admin
	- index.js : general routes /
	- <newFile>.js : the name of file should be a noun, where we group customized routes as a noun, think of the api endpoints and we can group them semantically 
- views
	- error.ejs : error page
	- index.ejs : everything else
- favicon.ico : Sqkii's favourite mouse logo!
- package.json : app configuration
- server.js : the navigator of routes, main backbone of server
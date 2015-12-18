var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/cheeselike/', function(req, res, next) {
	next();
});

module.exports = router;

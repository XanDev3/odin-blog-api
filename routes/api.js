var express = require('express');
var router = express.Router();

/* Home page/index route. */
router.get('/', function(req, res, next) {
  res.redirect('/api/posts');
});

/**** Posts Controller Routes */


/**** Comments Controller Routes */


/**** Authentication Controller Routes */

module.exports = router;

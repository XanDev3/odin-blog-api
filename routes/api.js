var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController')

/* Home page/index route. */
router.get('/', function(req, res, next) {
  res.json({ message: '/api'});
});

/**** Posts Controller Routes */


/**** Comments Controller Routes */


/**** Authentication Controller Routes */
router.post("/login", authController.login)

module.exports = router;

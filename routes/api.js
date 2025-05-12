var express = require('express')
var router = express.Router()
const authController = require('../controllers/authController')
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const passport = require('passport')


router.get('/', (req, res, next) => {
  res.json({ message: '/api' })
})

/**** Posts Controller Routes */

router.get('/posts', postController.posts_list)

router.get('/posts/:postid', postController.post_get)

router.post(
  '/posts/',
  passport.authenticate('jwt-admin', { session: false }),
  postController.post_create
)

router.put('/posts/:postid', passport.authenticate('jwt-admin', { session: false }), postController.post_update)

router.delete('/posts/:postid', passport.authenticate('jwt-admin', { session: false }), postController.post_delete)

/**** Comments Controller Routes */
router.get('/posts/:postid/comments', commentController.comments_list)
router.get('/posts/:postid/comments/:commentid', commentController.comment_get)
// protected so only signed in users can create comments
router.post(
  '/posts/:postid/comments',
  passport.authenticate('jwt', { session: false }),
  commentController.comment_create
)
// protected so only admin can update comments
router.put('/posts/:postid/comments/:commentid', passport.authenticate('jwt-admin', { session: false }), commentController.comment_update)
// protected so only admin can delete comments
router.delete('/posts/:postid/comments/:commentid', passport.authenticate('jwt-admin', { session: false }), commentController.comment_delete)

/**** Authentication Controller Routes */

router.post('/signup', authController.signup)

router.post('/login', authController.login)
router.post('/logout', authController.logout)


/**** Protected route */
router.get(
  '/protected',
  passport.authenticate('jwt-admin', { session: false }),
  (req, res, next) => {
    res
      .status(200)
      .json({ message: 'You successfully accessed the protected route' })
  }
)
module.exports = router

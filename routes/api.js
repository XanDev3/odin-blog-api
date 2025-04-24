var express = require('express')
var router = express.Router()
const authController = require('../controllers/authController')
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')
const passport = require('passport')
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - text
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *         text:
 *           type: string
 *           description: The text content of the post
 *         user:
 *           type: string
 *           description: the user who created the post
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the post creation
 *       example:
 *         title: Example Post
 *         text: This is an example blog post.
 *         user: "65dfb8a847a155d99e1a9498"
 *         timestamp: 2024-03-01T12:00:00Z
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           description: The text content of the comment
 *         user:
 *           type: string
 *           description: the user who created the comment
 *         post:
 *           type: string
 *           description: the post this comment belongs to
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the comment creation
 *       example:
 *         text: This is an example comment.
 *         user: "65dfb8a847a155d99e1a9498"
 *         post: "65dfb8a847a155d99e1a9499"
 *         timestamp: 2024-03-01T12:00:00Z
 *     Error:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *            description: A description of the error
 *        example:
 *          message: 'An error has occurred'
 */
/* Home page/index route. */
/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Returns a message that describes the /api endpoint
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Returns a message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: /api
 */
router.get('/', function (req, res, next) {
  res.json({ message: '/api' })
})

/**** Posts Controller Routes */
/**
 * @swagger
 * /api/posts:
 *  get:
 *    summary: Get all blog posts
 *    tags: [Posts]
 *    responses:
 *      200:
 *        description: Returns all blog posts
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Post'
 */
router.get('/posts', postController.posts_list)
/**
 * @swagger
 * /api/posts/{postid}:
 *   get:
 *     summary: Get a blog post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postid
 *         required: true
 *         description: ID of the blog post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the blog post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *          description: Post not found
 *          content:
 *             application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Error'
 */
router.get('/posts/:postid', postController.post_get)
/**
 * @swagger
 * /api/posts/:
 *   post:
 *     summary: Create a new blog post (protected - Admin only)
 *     tags: [Posts]
 *     security:
 *       - jwtAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/posts/',
  passport.authenticate('jwt-admin', { session: false }),
  postController.post_create
)
/**
 * @swagger
 * /api/posts/{postid}:
 *   put:
 *     summary: Update a blog post (protected - Admin only)
 *     tags: [Posts]
 *     security:
 *       - jwtAuth: []
 *     parameters:
 *       - in: path
 *         name: postid
 *         required: true
 *         description: ID of the blog post
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *          description: Post not found
 *          content:
 *             application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Error'
 */
router.put('/posts/:postid', passport.authenticate('jwt-admin', { session: false }), postController.post_update)
/**
 * @swagger
 * /api/posts/{postid}:
 *   delete:
 *     summary: Delete a blog post (protected - Admin only)
 *     tags: [Posts]
 *     security:
 *       - jwtAuth: []
 *     parameters:
 *       - in: path
 *         name: postid
 *         required: true
 *         description: ID of the blog post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *          description: Post not found
 *          content:
 *             application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Error'
 */
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
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/signup', authController.signup)

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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     jwtAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   tags:
 *     - name: Home
 *       description: Home related routes
 *     - name: Posts
 *       description: API endpoints related to blog posts
 *     - name: Comments
 *       description: API endpoints related to comments on blog posts
 */
module.exports = router

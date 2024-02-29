require('dotenv').config
const Post = require('../models/post')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const myValidationResult = validationResult.withDefaults({
  formatter: error => error.msg
})

//main page for blog with list of blogs
exports.posts_list = asyncHandler(async (req, res, next) => {
  try {
    const allPosts = await Post.find({})
      .sort({ createdAt: 'descending' })
      .populate('author')
      .exec()
    res.json({ message: 'Successfully retrieved all posts', allPosts })
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: 'Posts not found' })
  }
})

//individual blog post page
exports.post_get = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postid)
      .populate('author')
      .exec()
    res.status(200).json({ message: 'Successfully retrieved post', post })
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: 'Post not found' })
  }
})

// blog post create route, should be protected with jwt-admin in router
exports.post_create = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 9999 })
    .withMessage('Content cannot exceed 9999 characters'),
  asyncHandler(async (req, res, next) => {
    // check for errors using my formatted validation results from above
    const errors = myValidationResult(req).array()

    // validation error exists
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    } else {
      // No Errors
      const { title, content } = req.body
      const newPost = new Post({
        title,
        content,
        author: req.user._id
      })
      try {
        await newPost.save()
        res.status(200).json({ message: 'Successfully created Post' })
      } catch (err) {
        res.status(500).json({ message: 'Failed to create post' })
      }
    }
  })
]

// blog post update/edit route, should be protected with jwt-admin in router
exports.post_update = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 9999 })
    .withMessage('Content cannot exceed 9999 characters'),
  body('isPublished')
    .isBoolean({ strict: true })
    .withMessage('Must be true or false not a string'),

  asyncHandler(async (req, res, next) => {
    // check for errors using my formatted validation results from above
    const errors = myValidationResult(req).array()

    if (errors.length > 0) {
      //errors exists
      return res.status(400).json({ errors })
    } else {
      // No Errors
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.user,
        isPublished: req.body.isPublished,
        _id: req.params.postid
      })

      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.postid,
          post,
          { new: true } //option needed for mongoose to return updated document, returns the original one by default
        )
        res
          .status(200)
          .setHeader('Content-Type', 'application/json')
          .json({ message: 'Successfully updated post', updatedPost })
      } catch (err) {
        res.status(500).setHeader('Content-Type', 'application/json').json({ message: 'Failed to update post' })
      }
    }
  })
]

// blog post delete route, should be protected with jwt-admin in router
exports.post_delete = asyncHandler(async (req, res, next) => {
  try {
    const postToDelete = await Post.findByIdAndDelete(req.params.postid)
    res.status(200).json({ message: 'Successfully deleted post', postToDelete })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post' })
  }
})

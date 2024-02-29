require('dotenv').config
const Post = require('../models/post')
const Comment = require('../models/comment')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const myValidationResult = validationResult.withDefaults({
  formatter: error => error.msg
})

// get all comments for a post
exports.comments_list = asyncHandler(async (req, res, next) => {
  try {
    const allComments = await Comment.find({ post: req.params.postid }).populate('author').exec()
    res
      .status(200)
      .json({ message: 'Successfully retrieved all comments', allComments })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Could not retrieve comments" })
  }
})

// get single comment for a post
exports.comment_get = asyncHandler(async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentid).populate('author').exec()
    res.status(200).json({ message: 'Successfully retrieved comment', comment })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Could not retrieve comment" })
  }
})

// create a new comment for a post should be protected with jwt in router
exports.comment_create = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 500 })
    .withMessage('Content cannot exceed 500 characters'),
  asyncHandler(async (req, res, next) => {
    //make array with any validation errors
    const errors = myValidationResult(req).array()

    if (errors.length > 0) {
      //if there are errors in the array
      return res.status(400).json({ errors })
    } else {
      try {
        const newComment = new Comment({
          content: req.body.content,
          author: req.user._id,
          post: req.params.postid
        })
         await newComment.save()
        res.status(200).json({ message: 'Successfully created comment'})
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Could not create comment" })
      }
    }
  })
]

// update a comment for a post
exports.comment_update = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 500 })
    .withMessage('Content cannot exceed 500 characters'),
  asyncHandler(async (req, res, next) => {
    //make array with any validation errors
    const errors = myValidationResult(req).array()

    if (errors.length > 0) {
      //if there are errors in the array
      return res.status(400).json({ errors })
    } else {
      try {
        const comment = new Comment({
          content: req.body.content,
          post: req.params.postid,
          _id: req.params.commentid
        })
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.commentid,
            comment,
            {new: true} //option needed for mongoose to return updated document, returns the original one by default
        )
        res.status(200).json({ message: 'Successfully updated comment', updatedComment })
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Could not update comment" })
      }
    }
  })
]

// delete a comment for a post
exports.comment_delete = asyncHandler(async (req, res, next) => {
  try {
    const commentToDelete = await Comment.findByIdAndDelete(req.params.commentid)
    res.status(200).json({ message: 'Successfully deleted post', commentToDelete })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post' })
  }
})

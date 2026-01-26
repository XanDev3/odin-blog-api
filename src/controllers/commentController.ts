import "dotenv/config";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import asyncHandler from "express-async-handler";
import { body, validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ICommentDocument } from "../types/models.js";

// Custom validation result that extracts only error messages
const myValidationResult = validationResult.withDefaults({
  formatter: (error: ValidationError) => error.msg,
});

// get all comments for a post
export const comments_list = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const allComments: ICommentDocument[] = await Comment.find({ post: req.params.postid })
      .populate("author")
      .exec();
    res
      .status(200)
      .json({ message: "Successfully retrieved all comments", allComments });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve comments" });
  }
});

// get single comment for a post
export const comment_get = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const comment = await Comment.findById(req.params.commentid)
      .populate("author")
      .exec();
    
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    
    res
      .status(200)
      .json({ message: "Successfully retrieved comment", comment });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve comment" });
  }
});

// create a new comment for a post should be protected with jwt in router
export const comment_create = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 500 })
    .withMessage("Content cannot exceed 500 characters"),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    //make array with any validation errors
    const errors = myValidationResult(req).array();

    if (errors.length > 0) {
      //if there are errors in the array
      res.status(400).json({ errors });
      return;
    }
    
    try {
      const newComment = new Comment({
        content: req.body.content,
        author: (req.user as any)._id,
        post: req.params.postid,
      });
      await newComment.save();
      res.status(201).json({ message: "Successfully created comment" });
    } catch (err: unknown) {
      console.error(err);
      res.status(500).json({ message: "Failed to create comment" });
    }
  }),
];

// update a comment for a post
export const comment_update = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 500 })
    .withMessage("Content cannot exceed 500 characters"),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    //make array with any validation errors
    const errors = myValidationResult(req).array();

    if (errors.length > 0) {
      //if there are errors in the array
      res.status(400).json({ errors });
      return;
    }
    
    try {
      const comment = new Comment({
        content: req.body.content,
        post: req.params.postid,
        _id: req.params.commentid,
      });
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.commentid,
        comment,
        { new: true } //option needed for mongoose to return updated document, returns the original one by default
      );
      
      if (!updatedComment) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      
      res
        .status(200)
        .json({ message: "Successfully updated comment", updatedComment });
    } catch (err: unknown) {
      console.error(err);
      res.status(500).json({ message: "Failed to update comment" });
    }
  }),
];

// delete a comment for a post
export const comment_delete = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const commentToDelete = await Comment.findByIdAndDelete(
      req.params.commentid
    );
    
    if (!commentToDelete) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    
    res
      .status(200)
      .json({ message: "Successfully deleted comment", commentToDelete });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

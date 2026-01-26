
import Post from "../models/post.js";
import { IPostDocument } from "../types/models.js";
import { IUserDocument } from "../types/models.js";
import asyncHandler from "express-async-handler";
import { body, validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Custom validation result that extracts only error messages
const myValidationResult = validationResult.withDefaults({
  formatter: (error: ValidationError) => error.msg,
});

//main page for blog with list of blogs
export const posts_list = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const allPosts: IPostDocument[] = await Post.find({})
      .sort({ createdAt: "descending" })
      .populate("author")
      .exec();
    res.json({ message: "Successfully retrieved all posts", allPosts });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
});

//individual blog post page
export const post_get = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.postid)
      .populate("author")
      .exec();
    
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    
    res.status(200).json({ message: "Successfully retrieved post", post });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve post" });
  }
});

// blog post create route, should be protected with jwt-admin in router
export const post_create = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 9999 })
    .withMessage("Content cannot exceed 9999 characters"),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    // check for errors using my formatted validation results from above
    const errors = myValidationResult(req).array();

    // validation error exists
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
    
    // No Errors
    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      author: (req.user as IUserDocument)._id,
    });
    try {
      await newPost.save();
      res.status(201).json({ message: "Successfully created Post" });
    } catch (err: unknown) {
      console.error(err);
      res.status(500).json({ message: "Failed to create post" });
    }
  }),
];

// blog post update/edit route, should be protected with jwt-admin in router
export const post_update = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 9999 })
    .withMessage("Content cannot exceed 9999 characters"),
  body("isPublished")
    .isBoolean({ strict: true })
    .withMessage("Must be true or false not a string"),

  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    // check for errors using my formatted validation results from above
    const errors = myValidationResult(req).array();

    if (errors.length > 0) {
      //errors exists
      res.status(400).json({ errors });
      return;
    }
    
    // No Errors
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user,
      isPublished: req.body.isPublished,
      _id: req.params.postid,
    });

    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postid,
        post,
        { new: true } //option needed for mongoose to return updated document, returns the original one by default
      );
      
      if (!updatedPost) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      
      res
        .status(200)
        .json({ message: "Successfully updated post", updatedPost });
    } catch (err: unknown) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to update post" });
    }
  }),
];

// blog post delete route, should be protected with jwt-admin in router
export const post_delete = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const postToDelete = await Post.findByIdAndDelete(req.params.postid);
    
    if (!postToDelete) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    
    res
      .status(200)
      .json({ message: "Successfully deleted post", postToDelete });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

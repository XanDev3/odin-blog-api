import express from "express";
import { user_signup, user_login, user_logout } from "../controllers/authController.js";
import { posts_list, post_get, post_create, post_update, post_delete } from "../controllers/postController.js";
import { comments_list, comment_get, comment_create, comment_update, comment_delete } from "../controllers/commentController.js";
import passport from "passport";

const router = express.Router();

/**** Posts Controller Routes */

router.get("/posts", posts_list);

router.get("/posts/:postid", post_get);

router.post(
  "/posts/",
  passport.authenticate("jwt-admin", { session: false }),
  post_create
);

router.put(
  "/posts/:postid",
  passport.authenticate("jwt-admin", { session: false }),
  post_update
);

router.delete(
  "/posts/:postid",
  passport.authenticate("jwt-admin", { session: false }),
  post_delete
);

/**** Comments Controller Routes */
router.get("/posts/:postid/comments", comments_list);
router.get("/posts/:postid/comments/:commentid", comment_get);
// protected so only signed in users can create comments
router.post(
  "/posts/:postid/comments",
  passport.authenticate("jwt", { session: false }),
  comment_create
);
// protected so only admin can update comments
router.put(
  "/posts/:postid/comments/:commentid",
  passport.authenticate("jwt-admin", { session: false }),
  comment_update
);
// protected so only admin can delete comments
router.delete(
  "/posts/:postid/comments/:commentid",
  passport.authenticate("jwt-admin", { session: false }),
  comment_delete
);

/**** Authentication Controller Routes */

router.post("/signup", user_signup);

router.post("/login", user_login);
router.post("/logout", user_logout);

/**** Protected route */
router.get(
  "/protected",
  passport.authenticate("jwt-admin", { session: false }),
  (req, res, next) => {
    res
      .status(200)
      .json({ message: "You successfully accessed the protected route" });
  }
);
export default router;
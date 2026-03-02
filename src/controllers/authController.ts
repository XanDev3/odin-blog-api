import "dotenv/config";
import User from "../models/user.js";
import { IUserDocument } from "../types/models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import asyncHandler from "express-async-handler";
import { body, validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Custom validation result that extracts only error messages
const myValidationResult = validationResult.withDefaults({
  formatter: (error: ValidationError) => error.msg,
});

/*    User Signup    */
export const user_signup = [
  body("username")
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Username is required")
    .isLength({ max: 40 })
    .withMessage("Username cannot be more than 40 characters")
    .custom((username: string) => {
      // alphanumeric and "_" non-consecutive
      const pattern = /^(?!.*__)[A-Za-z0-9_]+$/;
      return pattern.test(username);
    })
    .withMessage(
      "Username can only contain alphanumeric and non-consecutive underscores",
    )
    .custom(async (username: string) => {
      const usernameTaken = await User.isUsernameTaken(username);
      if (usernameTaken) return Promise.reject("Username is already taken");

      return true;
    })
    .withMessage("Username is already taken"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    // check for errors
    // using my formatted validation results from above
    const errors = myValidationResult(req).array();

    // validation error exists
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // No Errors
    const { username, password } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = new User({
        username: username,
        password: hashedPassword,
        isAdmin: false,
      });

      // Save new user in database
      const savedUser = await user.save();

      // Get new user's id, username and isAdmin properties in order to sign jwt with it
      const body = {
        id: savedUser._id,
        username: savedUser.username,
        isAdmin: savedUser.isAdmin,
      };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET as string, {
        expiresIn: "2h",
      });
      res.json({
        // Properties from our body object created above
        message: "Signup Successful",
        id: body.id,
        user: body.username,
        token: token,
      });
    } catch (err: unknown) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Signup failed, see API Server logs for details" });
    }
  }),
];

/*    User login    */
export const user_login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Using Passport to handle login
    try {
      passport.authenticate(
        "login",
        async (
          err: Error | null,
          user: IUserDocument | false,
          info: { message?: string },
        ) => {
          if (err || !user) {
            // Authentication Failed
            res.status(401).json({
              info,
            });
            return;
          }
          req.login(user, { session: false }, async (err: Error | null) => {
            if (err) return next(err);
            // Create token
            const body = {
              _id: user._id,
              username: user.username,
              isAdmin: user.isAdmin,
            };
            const token = jwt.sign(
              { user: body },
              process.env.JWT_SECRET as string,
              {
                expiresIn: "2h",
              },
            );

            res.status(200).json({
              message: "Login Successful",
              admin: body.isAdmin,
              id: body._id,
              user: body.username,
              token,
            });
          });
        },
      )(req, res, next);
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({
        error: "Login failed",
      });
    }
  },
);
/*    User logout    */
export const user_logout = (
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Logout is implemented on the FrontEnd by clearing token (req.logout require express-session middleware which is not currently implemented)
  res.status(200).json({ message: "Logout successful" });
};


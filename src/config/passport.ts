import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { IUserDocument } from "../types/models.js";

/**
 * Configure all Passport authentication strategies
 * Must be called before passport.initialize() in app.ts
 */
export function configurePassport(): void {
  // ==========================================
  // STRATEGY 1: LocalStrategy for Login
  // ==========================================
  // Purpose: Validates username/password credentials
  // Used by: POST /api/v1/auth/login endpoint
  // Callback params: username, password, done(error, user, info)

  passport.use(
    "login",
    new LocalStrategy(async (username, password, done) => {
      try {
        const user: IUserDocument | null = await User.findOne({
          username: username,
        });

        if (!user) {
          // User doesn't exist in database
          return done(null, false, {
            message: `Invalid username "${username}"`,
          });
        }

        const match: boolean = await bcrypt.compare(password, user.password);
        if (!match) {
          // Password doesn't match
          return done(null, false, { message: "Incorrect password" });
        }

        // Authentication successful - return user document
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  // ==========================================
  // STRATEGY 2: JwtStrategy for Authenticated Users
  // ==========================================
  // Purpose: Validates JWT token for any authenticated user
  // Used by: Routes that need authentication (e.g., POST /api/v1/posts/:postid/comments)
  // Token format: Authorization: Bearer <jwt-token>
  // Populates: req.user with the authenticated user document

  const jwtOptions: StrategyOptions = {
    secretOrKey: process.env.JWT_SECRET as string,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (token, done) => {
      console.log(token);
      try {
        const user: IUserDocument | null = await User.findById(token.user._id);

        if (!user) {
          // Token is valid but user no longer exists in database
          return done(null, false, { message: "Unable to find user" });
        }

        // Token valid and user exists - populate req.user
        return done(null, user);
      } catch (error) {
        return done(error, false, { message: "Authentication failed" });
      }
    }),
  );

  // ==========================================
  // STRATEGY 3: JwtStrategy for Admin-Only Routes
  // ==========================================
  // Purpose: Validates JWT token AND checks if user is an admin
  // Used by: Admin routes (e.g., POST/PUT/DELETE /api/v1/posts)
  // Token format: Authorization: Bearer <jwt-token>
  // Additional check: user.isAdmin must be true

  passport.use(
    "jwt-admin",
    new JwtStrategy(jwtOptions, async (token, done) => {
      console.log(token);
      try {
        const user: IUserDocument | null = await User.findById(token.user._id);

        if (!user) {
          // Token is valid but user no longer exists
          return done(null, false, { message: "Unable to find user" });
        } else if (user.isAdmin) {
          // User exists AND is an admin - allow access
          return done(null, user);
        } else {
          // User exists but is NOT an admin - deny access
          return done(null, false, { message: "User is not an Admin" });
        }
      } catch (error) {
        return done(error, false, { message: "Authentication failed" });
      }
    }),
  );
}

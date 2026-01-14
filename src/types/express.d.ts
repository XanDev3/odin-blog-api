import { IUserDocument } from "./models.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        username: string;
        isAdmin: boolean;
      };
    }
  }
}

export {};

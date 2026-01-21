import { Document, Model, Types } from 'mongoose';

// User Interfaces
export interface IUser {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

export interface IUserModel extends Model<IUserDocument> {
  isUsernameTaken(username: string): Promise<boolean>;
}

// Post Interfaces
export interface IPost {
  title: string;
  content: string;
  author: Types.ObjectId[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostDocument extends IPost, Document {
  _id: Types.ObjectId;
  url: string;
}

export interface IPostModel extends Model<IPostDocument> {}

// Comment Interfaces
export interface IComment {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentDocument extends IComment, Document {
  _id: Types.ObjectId;
  url: string;
}

export interface ICommentModel extends Model<ICommentDocument> {}

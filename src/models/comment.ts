import mongoose, { Schema } from "mongoose";
import { ICommentDocument, ICommentModel } from "../types/models.js";

const CommentSchema = new Schema<ICommentDocument>(
  {
    content: { type: String, required: true, maxLength: 500 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
  },
  { timestamps: true }
)

// Virtual for Post's URL
CommentSchema.virtual('url').get(function (this: ICommentDocument): string {
  // Arrow function not used since we'll need the this object
  return `/posts/${this._id}`;
});
// Virtual for formatting DateTime using luxon
/* CommentSchema.virtual('timestamp_formatted').get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED)
  }) */
const Comment = mongoose.model<ICommentDocument, ICommentModel>('Comment', CommentSchema);
export default Comment;

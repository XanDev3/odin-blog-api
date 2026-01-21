import mongoose, { Schema } from "mongoose";
import { IUserDocument, IUserModel } from "../types/models.js";

const UserSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, maxLength: 40, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

/* // Virtual for User's URL
UserSchema.virtual("url").get(function () {
    // Arrow function not used since we'll need the this object
    return `/user/${this._id}`;
}); */

// Static method to check if username is taken with case-insensitive collation
UserSchema.statics.isUsernameTaken = async function (
  username: string,
): Promise<boolean> {
  const result = await this.exists({ username })
    .collation({ locale: "en", strength: 2 })
    .exec();
  return !!result;
};

// Export the model
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
export default User;

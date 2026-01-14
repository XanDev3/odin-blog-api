const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema(
  {
    content: { type: String, required: true, maxLength: 500 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
  },
  { timestamps: true }
)

// Virtual for Post's URL
CommentSchema.virtual('url').get(function () {
  // Arrow function not used since we'll need the this object
  return `/posts/${this._id}`
})
// Virtual for formatting DateTime using luxon
/* CommentSchema.virtual('timestamp_formatted').get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED)
  }) */

module.exports = mongoose.model('Comment', CommentSchema)

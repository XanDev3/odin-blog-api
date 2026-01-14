const mongoose = require('mongoose')
const { DateTime } = require('luxon')

const Schema = mongoose.Schema

const PostSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 100 },
    content: { type: String, required: true, maxLength: 9999 },
    author: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isPublished: { type: Boolean, default: false}
  },
  { timestamps: true }
)

// Virtual for Post's URL
PostSchema.virtual('url').get(function () {
  // Arrow function not used since we'll need the this object
  return `/posts/${this._id}`
})
// Virtual for formatting DateTime using luxon
/* PostSchema.virtual('timestamp_formatted').get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED)
}) */

// Export the model
module.exports = mongoose.model('Post', PostSchema)
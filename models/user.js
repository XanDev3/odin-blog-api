const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 40, unique: true, },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
})

/* // Virtual for User's URL
UserSchema.virtual("url").get(function (){
    // Arrow function not used since we'll need the this object
    return `/user/${this._id}`;
}) */

// Export the model
module.exports = mongoose.model("User", UserSchema);
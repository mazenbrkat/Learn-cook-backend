const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  userId: String,
  userName: String,
  userPicture: String, // أضف هذا الحقل
  text: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);
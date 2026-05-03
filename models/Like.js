const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Like", likeSchema);
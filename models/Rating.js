const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
   userId: String, // 🔥 خلي كله String
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one rating per user per recipe
ratingSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
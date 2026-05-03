const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: {
    type: String,
    required: true
  },
  video: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  prepTime: {
    type: Number, // in minutes
    default: 0
  },
  cookTime: {
    type: Number, // in minutes
    default: 0
  },
  servings: {
    type: Number,
    default: 1
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

module.exports = mongoose.model('Recipe', recipeSchema);
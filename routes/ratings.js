const express = require('express');
const Rating = require('../models/Rating');

const router = express.Router();


// ================= GET RATING =================
// GET /api/ratings/:recipeId?userId=xxx
router.get('/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { userId } = req.query;

    const ratings = await Rating.find({ recipeId });

    if (ratings.length === 0) {
      return res.json({
        averageRating: 0,
        totalRatings: 0,
        userRating: 0
      });
    }

    const averageRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    let userRating = 0;

    if (userId) {
      const userRatingDoc = ratings.find(r => r.userId === userId);
      userRating = userRatingDoc ? userRatingDoc.rating : 0;
    }

    res.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length,
      userRating
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= ADD / UPDATE RATING =================
// POST /api/ratings/:recipeId
router.post('/:recipeId', async (req, res) => {
  try {
    const { rating, userId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5'
      });
    }

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    // check existing
    const existingRating = await Rating.findOne({
      userId,
      recipeId: req.params.recipeId
    });

    if (existingRating) {
      // update
      existingRating.rating = rating;
      existingRating.updatedAt = Date.now();
      await existingRating.save();
    } else {
      // create
      await Rating.create({
        userId,
        recipeId: req.params.recipeId,
        rating
      });
    }

    res.json({ message: 'Rating saved successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
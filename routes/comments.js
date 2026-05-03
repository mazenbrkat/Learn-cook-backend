const express = require("express");
const Comment = require("../models/Comment");

const router = express.Router();


// ================= GET COMMENTS =================
// GET /api/comments/:recipeId
router.get("/:recipeId", async (req, res) => {
  try {
    const comments = await Comment.find({
      recipeId: req.params.recipeId
    }).sort({ createdAt: -1 });

    res.json(comments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= ADD COMMENT =================
// ================= ADD COMMENT =================
// POST /api/comments/:recipeId
router.post("/:recipeId", async (req, res) => {
  try {
    // 1. استلام userPicture بدلاً من userImage ليتطابق مع الفرونت إند
    const { text, userId, userName, userPicture } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // 2. تخزين userPicture في قاعدة البيانات
    const comment = await Comment.create({
      text,
      userId,
      userName,
      userPicture, // تأكد أن الاسم يطابق الموديل (Schema)
      recipeId: req.params.recipeId
    });

    res.json(comment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Like = require("../models/Like");

// 1. الحصول على عدد الإعجابات
router.get("/count/:recipeId", async (req, res) => {
  try {
    const count = await Like.countDocuments({ recipeId: req.params.recipeId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. التحقق هل المستخدم وضع إعجاب أم لا (تعديل mazenbrkat553@gmail.com error)
router.get("/:recipeId/:userId", async (req, res) => {
  try {
    const { recipeId, userId } = req.params;
    
    // التأكد أن الـ userId المرسل هو ObjectId صحيح وليس إيميل
    const liked = await Like.findOne({ recipeId, userId });
    
    res.json({ liked: !!liked });
  } catch (err) {
    // إذا حدث خطأ في الـ Cast (مثل إرسال إيميل بالخطأ) لا ينهار السيرفر
    res.json({ liked: false }); 
  }
});

// 3. إضافة أو حذف إعجاب (Toggle)
router.post("/:recipeId", async (req, res) => {
  try {
    const { userId } = req.body;
    const { recipeId } = req.params;

    const existingLike = await Like.findOne({ recipeId, userId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return res.json({ liked: false, message: "تم الحذف من المفضلة" });
    } else {
      await Like.create({ recipeId, userId });
      return res.json({ liked: true, message: "تم الإضافة للمفضلة" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
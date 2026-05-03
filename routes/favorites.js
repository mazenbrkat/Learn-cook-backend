const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// 1. التبديل بين الإضافة والحذف (Toggle)
router.post('/:recipeId', async (req, res) => {
  try {
    const { userId } = req.body; 
    const { recipeId } = req.params;

    // البحث إذا كان المستخدم أضاف هذه الوصفة مسبقاً
    const existing = await Favorite.findOne({ userId, recipeId });

    if (existing) {
      // إذا كانت موجودة، احذفها (Unlike)
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ liked: false, message: "تم الحذف من المفضلة" });
    } else {
      // إذا لم تكن موجودة، أضفها (Like)
      await Favorite.create({ userId, recipeId });
      return res.status(201).json({ liked: true, message: "تمت الإضافة للمفضلة" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. جلب مفضلات مستخدم معين (لصفحة Favorites.jsx)
router.get('/user/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
      .populate('recipeId');
    
    // تصفية النتائج لضمان عدم إرسال وصفات قد تكون حذفت من قاعدة البيانات
    const recipes = favorites.map(f => f.recipeId).filter(r => r != null);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. التحقق من حالة القلب (هل المستخدم معجب بالوصفة؟)
router.get('/check/:recipeId/:userId', async (req, res) => {
  try {
    const found = await Favorite.findOne({ 
      recipeId: req.params.recipeId, 
      userId: req.params.userId 
    });
    res.json({ liked: !!found });
  } catch (err) {
    res.json({ liked: false });
  }
});

router.get("/count/:recipeId", async (req, res) => {
  try {
    const count = await Favorite.countDocuments({ recipeId: req.params.recipeId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
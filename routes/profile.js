const router = require("express").Router();
const Favorite = require("../models/Favorite"); // تم التغيير لضمان المزامنة مع القلوب
const Comment = require("../models/Comment");
const Rating = require("../models/Rating");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// 👤 1. جلب بيانات البروفايل (المفضلة، التعليقات، التقييمات)
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // البحث في موديل Favorite لجلب الوصفات التي وضع المستخدم عليها قلب
    const favorites = await Favorite.find({ userId }).populate("recipeId");
    
    // جلب التعليقات والتقييمات الخاصة بالمستخدم مع بيانات الوصفة
    const comments = await Comment.find({ userId }).populate("recipeId");
    const ratings = await Rating.find({ userId }).populate("recipeId");

    res.json({
      // تحويل مصفوفة المفضلات لتكون مصفوفة وصفات مباشرة لسهولة العرض في الفرونت إند
      likes: favorites.map(f => f.recipeId).filter(Boolean), 
      comments,
      ratings
    });
  } catch (err) {
    console.error("Error fetching profile data:", err);
    res.status(500).json({ message: "خطأ في جلب بيانات البروفايل" });
  }
});

// 📁 2. إعدادات رفع الصور (Multer Config)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // تأكد من وجود مجلد uploads في جذر السيرفر
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // حد أقصى 2 ميجا للصورة
});

// ✏️ 3. تحديث بيانات الملف الشخصي (الاسم والصورة)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = { username: name };

    // إذا رفع المستخدم صورة جديدة، قم بتحديث المسار
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود" });
    }

    // إرسال البيانات المحدثة بنفس هيكلة التخزين في الـ LocalStorage
    res.json({
      id: user._id,
      name: user.username,
      email: user.email,
      picture: user.image,
      role: user.role
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "حصل خطأ أثناء تحديث بياناتك" });
  }
});

module.exports = router;
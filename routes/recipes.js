const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const Recipe = require('../models/Recipe');

const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");

// ================= Multer =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});


// ================= Helper 🔥 =================
const parseIngredients = (value) => {
  if (!value) return [];

  // لو Array جاهز
  if (Array.isArray(value)) return value;

  // لو JSON string
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    // fallback split
    return value
      .split(/\r?\n|,|;/)
      .map(i => i.trim())
      .filter(Boolean);
  }

  return [];
};


// ================= GET ALL =================
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const recipes = await Recipe.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Recipe.countDocuments(query);

    res.json({
      recipes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET ONE =================
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= POST =================
router.post(
  '/',
  auth,
  isAdmin,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Name is required'),

    body('ingredients').custom((value) => {
      const parsed = parseIngredients(value);
      if (parsed.length === 0) {
        throw new Error('At least one ingredient is required');
      }
      return true;
    }),

    body('instructions')
      .trim()
      .notEmpty()
      .withMessage('Instructions are required')
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const ingredients = parseIngredients(req.body.ingredients);

      const recipeData = {
        name: req.body.name,
        ingredients,
        instructions: req.body.instructions,
        video: req.body.video,
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
        servings: req.body.servings,
        image: req.file ? `/uploads/${req.file.filename}` : undefined
      };

      const recipe = new Recipe(recipeData);
      const savedRecipe = await recipe.save();

      res.status(201).json(savedRecipe);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);


// ================= PUT =================
router.put('/:id', auth,
  isAdmin, upload.single('image'), async (req, res) => {
  try {
    const ingredients = parseIngredients(req.body.ingredients);

    const recipeData = {
      name: req.body.name,
      ingredients,
      instructions: req.body.instructions,
      video: req.body.video,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      servings: req.body.servings,
      ...(req.file && { image: `/uploads/${req.file.filename}` }),
      updatedAt: Date.now()
    };

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      recipeData,
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// ================= DELETE =================
router.delete('/:id',  auth,
  isAdmin,async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json({ message: 'Deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
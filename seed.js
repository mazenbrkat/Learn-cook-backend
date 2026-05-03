const Recipe = require('../models/Recipe');
const Favorite = require('../models/Favorite');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Recipe.deleteMany({});
    await Favorite.deleteMany({});
    await Rating.deleteMany({});
    await Comment.deleteMany({});

    // Seed recipes
    const recipes = [
      {
        name: "Classic Margherita Pizza",
        ingredients: ["Pizza dough", "Tomato sauce", "Fresh mozzarella", "Basil leaves", "Olive oil", "Salt"],
        instructions: "1. Preheat oven to 475°F (245°C).\n2. Roll out pizza dough on floured surface.\n3. Spread tomato sauce evenly.\n4. Add mozzarella and basil.\n5. Drizzle with olive oil and sprinkle salt.\n6. Bake for 12-15 minutes until crust is golden.",
        video: "https://www.youtube.com/embed/1-SJGQ2HLp8",
        prepTime: 20,
        cookTime: 15,
        servings: 4
      },
      {
        name: "Chocolate Chip Cookies",
        ingredients: ["All-purpose flour", "Butter", "Brown sugar", "White sugar", "Eggs", "Vanilla extract", "Chocolate chips", "Baking soda", "Salt"],
        instructions: "1. Preheat oven to 375°F (190°C).\n2. Cream butter and sugars together.\n3. Beat in eggs and vanilla.\n4. Mix dry ingredients separately.\n5. Combine wet and dry ingredients.\n6. Fold in chocolate chips.\n7. Drop spoonfuls onto baking sheet.\n8. Bake for 9-11 minutes.",
        video: "https://www.youtube.com/embed/2Vv-BfVoq4g",
        prepTime: 15,
        cookTime: 10,
        servings: 24
      },
      {
        name: "Caesar Salad",
        ingredients: ["Romaine lettuce", "Croutons", "Parmesan cheese", "Caesar dressing", "Lemon juice", "Anchovy paste", "Garlic", "Olive oil"],
        instructions: "1. Wash and chop romaine lettuce.\n2. Make dressing: mix garlic, anchovy paste, lemon juice, and olive oil.\n3. Toss lettuce with dressing.\n4. Add croutons and parmesan.\n5. Serve immediately.",
        prepTime: 10,
        cookTime: 0,
        servings: 4
      },
      {
        name: "Fresh Orange Juice",
        ingredients: ["Fresh oranges", "Water", "Sugar (optional)"],
        instructions: "1. Cut oranges in half.\n2. Squeeze juice using juicer or by hand.\n3. Strain to remove pulp if desired.\n4. Add water and sugar to taste.\n5. Serve chilled.",
        prepTime: 5,
        cookTime: 0,
        servings: 2
      },
      {
        name: "Chicken Stir Fry",
        ingredients: ["Chicken breast", "Mixed vegetables", "Soy sauce", "Garlic", "Ginger", "Sesame oil", "Rice"],
        instructions: "1. Cut chicken into bite-sized pieces.\n2. Heat oil in wok or large pan.\n3. Cook chicken until browned.\n4. Add garlic and ginger.\n5. Add vegetables and stir fry.\n6. Add soy sauce and cook until done.\n7. Serve over rice.",
        prepTime: 15,
        cookTime: 15,
        servings: 4
      }
    ];

    await Recipe.insertMany(recipes);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
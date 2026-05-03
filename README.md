# Cooking Learn Backend API

Node.js backend for the Cooking Learn recipe application.

## Features

- **Recipes Management**: CRUD operations for recipes
- **User Authentication**: Register and login with JWT
- **Favorites System**: Save and manage favorite recipes
- **Ratings System**: Rate recipes (1-5 stars)
- **Comments System**: Add comments to recipes
- **Search & Filtering**: Filter recipes by category, difficulty, and search terms

## API Endpoints

### Recipes
- `GET /api/recipes` - Get all recipes (with optional filtering)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites/:recipeId` - Add to favorites
- `DELETE /api/favorites/:recipeId` - Remove from favorites

### Ratings
- `GET /api/ratings/:recipeId` - Get rating stats for recipe
- `POST /api/ratings/:recipeId` - Set user rating

### Comments
- `GET /api/comments/:recipeId` - Get comments for recipe
- `POST /api/comments/:recipeId` - Add comment
- `DELETE /api/comments/:commentId` - Delete comment

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update `.env` file with your MongoDB URI

3. Start the server:
```bash
npm start
# or for development
npm run dev
```

4. Seed the database (optional):
```
GET /api/seed
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cookinglearn
JWT_SECRET=your_jwt_secret_key_here
```

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS for cross-origin requests
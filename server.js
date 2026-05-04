const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 📁 uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ================= MIDDLEWARE =================

// 🔥 CORS مضبوط
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://learn-cook-frontend.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// 🔥 serve images
app.use('/uploads', express.static(uploadsDir));

// ================= DATABASE =================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cookinglearn')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// ================= ROUTES =================

app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/profile', require('./routes/profile')); // ✅ profile update
app.use('/api/favorites', require('./routes/favorites')); // ✅ favorites routes
app.use('/api/likes', require('./routes/likes'));
// ================= SERVER =================

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ================= SOCKET =================

const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("new-comment", (data) => {
    io.emit("receive-comment", data);
  });
});


// ================= SEED =================

app.get('/api/seed', async (req, res) => {
  const seedDatabase = require('./seed');
  await seedDatabase();
  res.json({ message: 'Database seeded successfully' });
});

// ================= ERROR =================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/users",
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".png");
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  res.json({ image: `/uploads/users/${req.file.filename}` });
});

module.exports = router;
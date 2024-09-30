const express = require("express");
const multer = require("multer");
const {
  uploadFile,
  manipulateImage,
} = require("../controllers/fileController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/upload", protect, upload.single("file"), uploadFile);
router.post("/manipulate", protect, manipulateImage);

module.exports = router;

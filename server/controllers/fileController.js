const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises; // Use promises for fs

exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const filePath = `uploads/${req.file.filename}`;
  res.json({ filePath, fileType: req.file.mimetype });
};

exports.manipulateImage = async (req, res) => {
  const { imagePath } = req.body;

  if (!imagePath) {
    return res.status(400).send("Image path is required");
  }

  const newPath = `uploads/grayscale_${path.basename(imagePath)}`;

  const validImageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".tiff",
    ".webp",
  ];
  const fileExtension = path.extname(imagePath).toLowerCase();

  if (!validImageExtensions.includes(fileExtension)) {
    return res
      .status(400)
      .send("The uploaded file is not a supported image format.");
  }

  try {
    await sharp(imagePath).grayscale().toFile(newPath);

    try {
      await fs.unlink(imagePath);
      console.log("Original image deleted successfully.");
    } catch (unlinkError) {
      console.error("Error unlinking the original image:", unlinkError);
    }

    res.json({ manipulatedImage: newPath });
  } catch (error) {
    console.error("Error manipulating image:", error);
    res.status(500).send("Error manipulating image");
  }
};

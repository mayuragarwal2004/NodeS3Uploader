require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadToS3 } = require("./connection.aws");
const app = express();

const PORT = process.env.PORT || 5001;

// Multer configuration
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/upload/single", upload.single("file"), async (req, res) => {
  if (req.file) {
    const folderName = req.body.folderName;
    try {
      let compressedImageBuffer;
      let fileName;

      // Check if the uploaded file is an image
      switch (req.file.mimetype) {
        case "image/jpeg":
        case "image/jpg":
        case "image/png":
          // Compress the uploaded image
          if (
            process.env.COMPRESS_IMAGE === "true" &&
            parseInt(process.env.COMPRESS_IMAGE_QUALITY)
          )
            compressedImageBuffer = await sharp(req.file.buffer)
              .jpeg({ quality: parseInt(process.env.COMPRESS_IMAGE_QUALITY) }) // Adjust quality as needed
              .toBuffer();

          // Generate a unique file name for the compressed image
          fileName = `${uuidv4()}.jpg`; // Save as jpg
          break;
        default:
          // For non-image files, upload directly
          fileName = `${uuidv4()}_${req.file.originalname}`;
          break;
      }

      // Check the size of compressed image buffer before uploading
      if (
        process.env.LIMIT_FILE_SIZE === "true" &&
        compressedImageBuffer &&
        compressedImageBuffer.length > process.env.MAX_FILE_SIZE
      ) {
        return res
          .status(400)
          .json({ error: "File size exceeds the limit after compression" });
      }

      if (folderName) {
        fileName = `${folderName}/${fileName}`;
      }

      if (process.env.UPLOAD_DIREECTORY) {
        fileName = `${process.env.UPLOAD_DIREECTORY}/${fileName}`;
      }

      // Upload the file to Amazon S3
      const s3UploadResult = await uploadToS3(
        fileName,
        compressedImageBuffer || req.file.buffer
      );

      // Check if S3 upload was successful
      if (!s3UploadResult.success) {
        return res.status(500).json({ error: "Error uploading file to S3" });
      }

      // Respond with success
      return res.status(200).json({
        success: true,
        message: `File uploaded successfully. File is avaiable at ${s3UploadResult.imageUrl}`,
        imageUrl: s3UploadResult.imageUrl,
      });
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(400).json({ error: "No file uploaded" });
  }
});

app.get("*", (req, res) => {
  if (process.env.SERVE_INDEX === "true") {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.status(404).send("Not found");
  }
});

app.listen(PORT, () => console.log("Server running on " + PORT));
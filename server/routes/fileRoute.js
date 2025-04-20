// routes/fileRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth"); // JWT verification middleware
const {
  uploadFile,
  downloadFile,
  getMyFiles,
  downloadEncryptedFile,
  markAsDownloaded,
} = require("../controllers/fileController");

// Get All Files Sent/Received
router.get("/my-files", auth.verifyToken, getMyFiles);

// Download Encrypted File by ID
router.get("/download/:fileId", auth.verifyToken, downloadEncryptedFile);

// Mark file as downloaded (Optional)
router.post("/mark-downloaded/:fileId", auth.verifyToken, markAsDownloaded);

// Upload Encrypted File (Add a POST route for uploading files)
router.post("/upload", auth.verifyToken, uploadFile); // Use POST for file upload

module.exports = router;

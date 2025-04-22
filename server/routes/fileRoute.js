// routes/fileRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  uploadFile,
  getMyFiles,
  
} = require("../controllers/fileController");

// Get All Files Sent/Received
router.get("/my-files/", auth.verifyToken, getMyFiles);

// Upload Encrypted File (Add a POST route for uploading files)
router.post("/upload", uploadFile); // Use POST for file upload

module.exports = router;

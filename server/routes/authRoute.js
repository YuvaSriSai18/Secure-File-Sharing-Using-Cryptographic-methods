const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  getPublicKey,
  getEncryptedPrivateKey,
  getUsers,
} = require("../controllers/authController");
const {
  validateSignupFields,
  validateLoginFields,
} = require("../middlewares/test");
const { verifyToken, private_verifyToken } = require("../middlewares/auth");

// User Signup (with key generation)
router.post("/signup", validateSignupFields, signUp); // ✅ should be a function

// User Login
router.post("/login", validateLoginFields, login);

// Get Public Key of a User (by email or ID)
router.get("/public-key/:userId", verifyToken, getPublicKey);

// Get Encrypted Private Key for Client-Side Decryption
router.get("/private-key/:userId", private_verifyToken, getEncryptedPrivateKey);

//Get all users
router.get("/users", verifyToken, getUsers);

module.exports = router;

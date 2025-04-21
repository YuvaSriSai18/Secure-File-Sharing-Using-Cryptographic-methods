const User = require("../models/User");
const Keys = require("../models/Keys");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateKeys,
  decryptPrivateKey,
} = require("../utils/generateKeyPairs");

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      email,
      name,
      password: hashedPassword,
    });

    const userKeyData = generateKeys();
    await user.save();
    let Key = new Keys({
      iv: userKeyData.iv,
      encryptedPrivateKey: userKeyData.encryptedPrivateKey,
      publicKey: userKeyData.publicKeyPem,
      salt: userKeyData.salt,
      tag: userKeyData.tag,
      uid: user._id,
    });
    await Key.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, userId: user._id, name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

const getPublicKey = async (req, res) => {
  const id = req.params.userId;
  try {
    const key = await Keys.findOne({ uid: id });
    if (!key) {
      return res.status(404).json({ message: `Key for id ${id} not found` });
    }
    return res.status(200).json({ publicKey: key.publicKey });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve key", error: err.message });
  }
};

const getEncryptedPrivateKey = async (req, res) => {
  const id = req.params.userId;
  try {
    let key = await Keys.findOne({ uid: id });
    if (!key) {
      return res.status(404).json({ message: `Key not found for ${id}` });
    }

    // const privateKey = decryptPrivateKey(key.encryptedPrivateKey);

    // return res.status(200).json({
    //   privateKey,
    // });
    return res.status(200).json({
      encryptedPrivateKey: key.encryptedPrivateKey,
      iv: key.iv,
      salt: key.salt,
      tag: key.tag,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve key", error: err.message });
  }
};

const getUsers = async (req, res) => {
  const userId = req.user.userId;
  // console.log(userId);
  try {
    const users = await User.find({ _id: { $ne: userId } }).select("-password"); // Exclude password field
    res.status(200).json(users); // Send users as response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  signUp,
  login,
  getPublicKey,
  getEncryptedPrivateKey,
  getUsers,
};

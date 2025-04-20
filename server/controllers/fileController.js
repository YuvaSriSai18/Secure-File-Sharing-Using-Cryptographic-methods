const forge = require("node-forge");
const File = require("../models/File");
const User = require("../models/User");
const {
  generateAESKey,
  encryptFileContent,
  decryptFileContent,
  encryptAESKey,
  decryptAESKey,
} = require("../utils/cryptoUtils");
const uploadFile = async (req, res) => {
  try {
    const { receiverEmail, fileName, fileType, metaData, fileContent } =
      req.body;
    const senderId = req.user.userId;

    // 1. Generate AES-256 key and IV
    const { aesKey, iv } = generateAESKey();

    // 2. Encrypt the file content
    const encryptedFile = encryptFileContent(fileContent, aesKey, iv);

    // 3. Get receiver's public key
    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });

    // 4. Encrypt AES key with receiver's public key
    const encryptedAESKey = encryptAESKey(aesKey, receiver.publicKey);

    // 5. Save file to DB
    const newFile = new File({
      sender: senderId,
      receiver: receiver._id,
      fileName,
      fileType,
      metaData,
      encryptedFile,
      encryptedAESKey,
    });

    await newFile.save();

    res
      .status(201)
      .json({ message: "File uploaded and encrypted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// Download Encrypted File
const downloadFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fileId, password } = req.body;

    const file = await File.findById(fileId).populate("sender receiver");
    if (!file || file.receiver._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // 1. Get user's encrypted private key
    const user = await User.findById(userId);
    const encryptedPrivateKeyBase64 = user.encryptedPrivateKey;
    const encryptedPrivateKey = forge.util.decode64(encryptedPrivateKeyBase64);
    const privateKeyPem = forge.rc2.decrypt(encryptedPrivateKey, password);

    // 2. Decrypt AES key with private key
    const aesKey = decryptAESKey(file.encryptedAESKey, privateKeyPem);

    // 3. Decrypt file content
    const decryptedFileContent = decryptFileContent(file.encryptedFile, aesKey);

    res.status(200).json({
      fileName: file.fileName,
      fileType: file.fileType,
      metaData: file.metaData,
      content: decryptedFileContent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed", error: err.message });
  }
};

const getMyFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const files = await File.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver");

    res.status(200).json({ files });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: err.message });
  }
};

// Download Encrypted File by ID
const downloadEncryptedFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.userId;
    const file = await File.findById(fileId).populate("sender receiver");

    if (!file) return res.status(404).json({ message: "File not found" });

    if (file.receiver._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({
      fileName: file.fileName,
      fileType: file.fileType,
      encryptedFile: file.encryptedFile,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to download file", error: err.message });
  }
};

// Mark file as downloaded (Optional)
const markAsDownloaded = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    if (!file) return res.status(404).json({ message: "File not found" });

    file.downloaded = true;
    await file.save();

    res.status(200).json({ message: "File marked as downloaded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to mark file as downloaded",
      error: err.message,
    });
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  getMyFiles,
  downloadEncryptedFile,
  markAsDownloaded,
};

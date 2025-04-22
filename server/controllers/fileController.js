const File = require("../models/File");
const User = require("../models/User");

const uploadFile = async (req, res) => {
  try {
    const { sender, receiver, message, files } = req.body;
    // 1. Validate receiver existence
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // 2. Save the encrypted file + message in DB
    const newFileMessage = new File({
      sender,
      receiver,
      message,
      files, // already encrypted file array from client
    });

    await newFileMessage.save();

    res
      .status(201)
      .json({ message: "Message with encrypted files saved successfully." });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

const getMyFiles = async (req, res) => {
  try {
    const userId = req.user.userId;

    const files = await File.find({ receiver: userId })
      .populate("sender", "name email") // populate useful sender info only
      .sort({ createdAt: -1 }); // sort by creation date in descending order

    // if (!files || files.length === 0) {
    //   return res.status(404).json({ message: "No files found for this user." });
    // }

    res.status(200).json({ files });
  } catch (err) {
    console.error("Error fetching files:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: err.message });
  }
};

module.exports = { uploadFile, getMyFiles };

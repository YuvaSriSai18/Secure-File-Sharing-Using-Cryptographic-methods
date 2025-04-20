const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String },
    encryptedFileData: { type: String, required: true },
    encryptedAESKey: { type: String, required: true },
    iv: { type: String, required: true },
    tag: { type: String, required: true },
    metaData: {
      fileName: { type: String },
      fileType: { type: String },
      fileSize: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);

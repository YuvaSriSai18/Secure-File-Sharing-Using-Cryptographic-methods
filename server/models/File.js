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

    encryptedFileData: { type: Buffer, required: true }, // Stored as binary
    encryptedAESKey: { type: String, required: true }, // Base64 encoded RSA-encrypted key

    encryptedMetadata: {
      fileName: { type: String },
      fileType: { type: String },
      fileSize: { type: Number },
    },

    isDownloaded: { type: Boolean, default: false },
    downloadedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);

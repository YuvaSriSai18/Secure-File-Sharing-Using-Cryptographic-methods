const mongoose = require("mongoose");
const file = mongoose.Schema({
  encryptedFileData: { type: String, required: true },
  encryptedAESKey: { type: String, required: true },
  iv: { type: String, required: true },
  tag: { type: String, required: true },
  metadata: {
    fileName: { type: String },
    fileType: { type: String },
    fileSize: { type: Number },
  },
});
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
    files: { type: [file] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);

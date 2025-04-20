const mongoose = require("mongoose");

const KeySchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publicKey: { type: String }, // PEM or base64 string
    encryptedPrivateKey: { type: String }, // encrypted with password
    iv: { type: String },
    salt: { type: String },
    tag: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Keys", KeySchema);

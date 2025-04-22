import forge from "node-forge";

// Utility: Decode base64 string to raw bytes
const decodeBase64 = (str) => forge.util.decode64(str);

// Utility: Convert forge bytes to Uint8Array
const forgeBytesToUint8Array = (bytes) => {
  const buffer = forge.util.createBuffer(bytes, 'raw');
  const uint8Array = new Uint8Array(buffer.length());
  for (let i = 0; i < buffer.length(); i++) {
    uint8Array[i] = buffer.at(i);
  }
  return uint8Array;
};

// 🔐 Decrypt AES key using RSA private key
const decryptAESKeyWithRSA = (encryptedAESKeyBase64, rsaPrivateKeyPem) => {
  const encryptedAESKeyBytes = decodeBase64(encryptedAESKeyBase64);
  const privateKey = forge.pki.privateKeyFromPem(rsaPrivateKeyPem);
  const aesKey = privateKey.decrypt(encryptedAESKeyBytes, 'RSA-OAEP');
  return aesKey;
};

// 🔐 Decrypt the file using AES-GCM
const decryptFile = (encryptedDataBase64, ivBase64, tagBase64, aesKey) => {
  const encryptedData = decodeBase64(encryptedDataBase64);
  const iv = decodeBase64(ivBase64);
  const tag = decodeBase64(tagBase64);

  const decipher = forge.cipher.createDecipher("AES-GCM", aesKey);
  decipher.start({
    iv: iv,
    tagLength: 128,
    tag: tag,
  });
  decipher.update(forge.util.createBuffer(encryptedData));
  const success = decipher.finish();

  if (!success) throw new Error("Decryption failed.");
  return decipher.output.getBytes(); // decrypted file bytes (binary string)
};

// 💾 Convert to Blob and Download
const downloadFile = (decryptedBytes, fileName, mimeType) => {
  const uint8Array = forgeBytesToUint8Array(decryptedBytes);
  const blob = new Blob([uint8Array], { type: mimeType || "application/octet-stream" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};

// 🚀 Full Decryption Flow
export const decryptAndDownloadFile = ({
  encryptedFileData,
  encryptedAESKey,
  iv,
  tag,
  metadata,
  rsaPrivateKeyPem,
}) => {
  try {
    const aesKey = decryptAESKeyWithRSA(encryptedAESKey, rsaPrivateKeyPem);
    const decryptedFileBytes = decryptFile(encryptedFileData, iv, tag, aesKey);
    downloadFile(decryptedFileBytes, metadata.fileName, metadata.fileType);
  } catch (error) {
    console.error("Decryption error:", error);
    alert("Failed to decrypt file.");
  }
};

import forge from "node-forge";

export const decryptFile = (encryptedData64, aesKey, iv64, tag64) => {
  const encryptedData = forge.util.decode64(encryptedData64);
  const iv = forge.util.decode64(iv64);
  const tag = forge.util.decode64(tag64);

  const decipher = forge.cipher.createDecipher("AES-GCM", aesKey);
  decipher.start({
    iv: iv,
    tagLength: 128,
    tag: tag,
  });

  decipher.update(forge.util.createBuffer(encryptedData));
  const success = decipher.finish();

  if (!success) {
    throw new Error("Decryption failed. Authentication tag mismatch.");
  }

  return decipher.output.getBytes(); // Decrypted binary
};

export const createFileFromDecryptedData = (decryptedBinary, fileName, mimeType) => {
  // Convert forge binary string to Uint8Array
  const byteArray = new Uint8Array(forge.util.createBuffer(decryptedBinary).toByteArray());

  // Create a Blob with the correct MIME type
  const blob = new Blob([byteArray], { type: mimeType });

  // Optional: Trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Also return a File object if needed
  return new File([blob], fileName, { type: mimeType });
};

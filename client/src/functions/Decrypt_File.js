import forge from "node-forge";

export const decryptFile = (encryptedData64, aesKey, iv64, tag64) => {
  const encryptedData = forge.util.decode64(encryptedData64);
  const iv = forge.util.decode64(iv64);
  const tag = forge.util.decode64(tag64);

  const decipher = forge.cipher.createDecipher('AES-GCM', aesKey);
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

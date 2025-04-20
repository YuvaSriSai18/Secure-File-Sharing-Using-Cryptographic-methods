import forge from 'node-forge'
const password = import.meta.env.VITE_AES_KEY

const decryptPrivateKey = (encryptedPayload) => {
  const payload = forge.util.decode64(encryptedPayload);

  // Convert string payload into raw binary bytes for slicing
  const rawBytes = forge.util.createBuffer(payload, "raw").getBytes();

  const iv = rawBytes.slice(0, 12);
  const salt = rawBytes.slice(12, 28);
  const encrypted = rawBytes.slice(28, rawBytes.length - 16);
  const tag = rawBytes.slice(rawBytes.length - 16);

  const key = forge.pkcs5.pbkdf2(password, salt, 100000, 32);

  const decipher = forge.cipher.createDecipher("AES-GCM", key);
  decipher.start({
    iv: iv,
    additionalData: salt,
    tagLength: 128,
    tag: tag,
  });

  decipher.update(forge.util.createBuffer(encrypted, "raw"));
  const success = decipher.finish();

  if (!success) {
    throw new Error("Failed to decrypt: Authentication tag mismatch");
  }

  return decipher.output.toString("utf8");
};

export default decryptPrivateKey ;
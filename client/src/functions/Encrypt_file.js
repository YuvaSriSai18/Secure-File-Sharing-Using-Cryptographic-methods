import forge from "node-forge";

// Generate a random AES key (256-bit)
export const generateAesKey = () => {
  return forge.random.getBytesSync(32);
};

// Generate a random IV (12 bytes recommended for GCM)
export const generateIv = () => {
  return forge.random.getBytesSync(12);
};

// Encrypt the file using AES-GCM
export const encryptFile = (fileBuffer, aesKey) => {
  const iv = generateIv();
  const cipher = forge.cipher.createCipher("AES-GCM", aesKey);

  cipher.start({
    iv: iv,
    tagLength: 128, // 16 bytes
  });

  cipher.update(forge.util.createBuffer(fileBuffer));
  cipher.finish();

  const encrypted = cipher.output.getBytes();
  const tag = cipher.mode.tag.getBytes();

  return {
    encryptedFileData: forge.util.encode64(encrypted),
    iv: forge.util.encode64(iv),
    tag: forge.util.encode64(tag),
  };
};

// Encrypt AES key using RSA Public Key (PEM format)
export const encryptAesKeyWithRsa = (aesKey, publicKeyPem) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encryptedKey = publicKey.encrypt(aesKey, "RSA-OAEP");
  return forge.util.encode64(encryptedKey);
};

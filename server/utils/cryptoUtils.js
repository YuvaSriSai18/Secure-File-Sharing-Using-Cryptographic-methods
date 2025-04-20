const forge = require('node-forge');

// Generate AES-256 Key and IV
const generateAESKey = () => {
  const aesKey = forge.random.getBytesSync(32); // 32 bytes = 256 bits
  const iv = forge.random.getBytesSync(12);     // 12 bytes IV recommended for GCM
  return { aesKey, iv };
};

// Encrypt file content using AES-GCM
const encryptFileContent = (fileContent, aesKey, iv) => {
  const cipher = forge.cipher.createCipher('AES-GCM', aesKey);
  cipher.start({
    iv: iv,
    tagLength: 128 // default is fine
  });
  cipher.update(forge.util.createBuffer(fileContent, 'utf8'));
  cipher.finish();

  const tag = cipher.mode.tag.getBytes();
  const encrypted = iv + cipher.output.getBytes() + tag;
  return forge.util.encode64(encrypted); // Store: IV + EncryptedData + Tag
};

// Decrypt file content using AES-GCM
const decryptFileContent = (encryptedFile, aesKey) => {
  const encryptedBytes = forge.util.decode64(encryptedFile);

  const iv = encryptedBytes.slice(0, 12);                       // first 12 bytes = IV
  const tag = encryptedBytes.slice(-16);                        // last 16 bytes = Auth Tag
  const encryptedData = encryptedBytes.slice(12, -16);          // middle = encrypted data

  const decipher = forge.cipher.createDecipher('AES-GCM', aesKey);
  decipher.start({
    iv: iv,
    tag: tag
  });
  decipher.update(forge.util.createBuffer(encryptedData));
  const success = decipher.finish();

  if (!success) {
    throw new Error('Decryption failed. Authentication tag mismatch.');
  }

  return decipher.output.toString('utf8');
};

// Encrypt AES key using a public key (RSA)
const encryptAESKey = (aesKey, publicKeyPem) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  return forge.util.encode64(publicKey.encrypt(aesKey));
};

// Decrypt AES key using a private key (RSA)
const decryptAESKey = (encryptedAESKey, privateKeyPem) => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  return privateKey.decrypt(forge.util.decode64(encryptedAESKey));
};

module.exports = {
  generateAESKey,
  encryptFileContent,
  decryptFileContent,
  encryptAESKey,
  decryptAESKey
};

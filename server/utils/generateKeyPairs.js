const forge = require("node-forge");
require("dotenv").config();
const password = process.env.AES_KEY;

const encryptPrivateKey = (privateKeyPem) => {
  const iv = forge.random.getBytesSync(12);
  const salt = forge.random.getBytesSync(16);

  const key = forge.pkcs5.pbkdf2(password, salt, 100000, 32);

  const cipher = forge.cipher.createCipher("AES-GCM", key);
  cipher.start({
    iv: iv,
    additionalData: salt,
    tagLength: 128,
  });

  cipher.update(forge.util.createBuffer(privateKeyPem, "utf8"));
  cipher.finish();

  const encrypted = cipher.output.getBytes();
  const tag = cipher.mode.tag.getBytes();

  const combined = { iv, salt, encrypted, tag };
  //   const combined2 = iv + salt + encrypted + tag;
  return combined;
};

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
const generateKeys = () => {
  const keyPair = forge.pki.rsa.generateKeyPair(2048);
  const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
  const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);

  const { iv, salt, encrypted, tag } = encryptPrivateKey(privateKeyPem);
  const combined = iv + salt + encrypted + tag;
  const encryptedPrivateKey = forge.util.encode64(combined);

  const userKeyData = {
    iv,
    salt,
    tag,
    encryptedPrivateKey,
    publicKeyPem,
  };
  return userKeyData;
};

module.exports = { generateKeys, decryptPrivateKey };

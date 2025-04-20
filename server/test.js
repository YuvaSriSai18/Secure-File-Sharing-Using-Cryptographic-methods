const forge = require("node-forge");
require("dotenv").config();
// Generate RSA key pair
function generateRSAKeys() {
  const keypair = forge.pki.rsa.generateKeyPair(2048);
  console.log(`Key Pairs : ${keypair}`)
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
  return { privateKeyPem, publicKeyPem };
}

// Encrypt private key using AES-GCM with PBKDF2
function encryptPrivateKey(privateKeyPem, password) {
  const iv = forge.random.getBytesSync(12); // 12 bytes for AES-GCM IV
  const salt = forge.random.getBytesSync(16); // 16 bytes salt

  const key = forge.pkcs5.pbkdf2(password, salt, 100000, 32); // 32 bytes = 256-bit AES key

  const cipher = forge.cipher.createCipher("AES-GCM", key);
  cipher.start({
    iv,
    additionalData: salt, // optional but helps integrity
    tagLength: 128, // GCM tag length in bits
  });

  cipher.update(forge.util.createBuffer(privateKeyPem, "utf8"));
  cipher.finish();

  const encrypted = cipher.output.getBytes();
  const tag = cipher.mode.tag.getBytes();

  // Combine: iv + salt + encrypted + tag
  const payload = forge.util.encode64(iv + salt + encrypted + tag);

  return payload;
}

// Decrypt private key
function decryptPrivateKey(encryptedPayloadBase64, password) {
  const payloadBytes = forge.util.decode64(encryptedPayloadBase64);

  const iv = payloadBytes.slice(0, 12);
  const salt = payloadBytes.slice(12, 28);
  const tag = payloadBytes.slice(-16);
  const encrypted = payloadBytes.slice(28, -16);

  const key = forge.pkcs5.pbkdf2(password, salt, 100000, 32);

  const decipher = forge.cipher.createDecipher("AES-GCM", key);
  decipher.start({
    iv,
    additionalData: salt,
    tagLength: 128,
    tag: tag,
  });

  decipher.update(forge.util.createBuffer(encrypted));
  const success = decipher.finish();

  if (!success) {
    throw new Error("Failed to decrypt: Authentication tag mismatch");
  }

  return decipher.output.toString("utf8");
}

// --- Demo ---
const { privateKeyPem, publicKeyPem } = generateRSAKeys();
console.log("Public Key:\n", publicKeyPem);
console.log("Private Key:\n", privateKeyPem);

// const password = process.env.AES_KEY;
// const encrypted = encryptPrivateKey(privateKeyPem, password);
// console.log("\nEncrypted Private Key (Base64):\n", encrypted);

// const decrypted = decryptPrivateKey(encrypted, password);
// console.log("\nDecrypted Private Key:\n", decrypted);


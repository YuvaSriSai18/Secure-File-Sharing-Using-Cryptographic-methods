const forge = require("node-forge");
// require("dotenv").config();
// Generate RSA key pair
// function generateRSAKeys() {
//   const keypair = forge.pki.rsa.generateKeyPair(2048);
//   console.log(`Key Pairs : ${keypair}`)
//   const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
//   const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
//   return { privateKeyPem, publicKeyPem };
// }

// Encrypt private key using AES-GCM with PBKDF2
// function encryptPrivateKey(privateKeyPem, password) {
//   const iv = forge.random.getBytesSync(12); // 12 bytes for AES-GCM IV
//   const salt = forge.random.getBytesSync(16); // 16 bytes salt

//   const key = forge.pkcs5.pbkdf2(password, salt, 100000, 32); // 32 bytes = 256-bit AES key

//   const cipher = forge.cipher.createCipher("AES-GCM", key);
//   cipher.start({
//     iv,
//     additionalData: salt, // optional but helps integrity
//     tagLength: 128, // GCM tag length in bits
//   });

//   cipher.update(forge.util.createBuffer(privateKeyPem, "utf8"));
//   cipher.finish();

//   const encrypted = cipher.output.getBytes();
//   const tag = cipher.mode.tag.getBytes();

//   // Combine: iv + salt + encrypted + tag
//   const payload = forge.util.encode64(iv + salt + encrypted + tag);

//   return payload;
// }

// // Decrypt private key
// function decryptPrivateKey(encryptedPayloadBase64, password) {
//   const payloadBytes = forge.util.decode64(encryptedPayloadBase64);

//   const iv = payloadBytes.slice(0, 12);
//   const salt = payloadBytes.slice(12, 28);
//   const tag = payloadBytes.slice(-16);
//   const encrypted = payloadBytes.slice(28, -16);

//   const key = forge.pkcs5.pbkdf2(password, salt, 100000, 32);

//   const decipher = forge.cipher.createDecipher("AES-GCM", key);
//   decipher.start({
//     iv,
//     additionalData: salt,
//     tagLength: 128,
//     tag: tag,
//   });

//   decipher.update(forge.util.createBuffer(encrypted));
//   const success = decipher.finish();

//   if (!success) {
//     throw new Error("Failed to decrypt: Authentication tag mismatch");
//   }

//   return decipher.output.toString("utf8");
// }

// --- Demo ---
// const { privateKeyPem, publicKeyPem } = generateRSAKeys();
// console.log("Public Key:\n", publicKeyPem);
// console.log("Private Key:\n", privateKeyPem);

// const password = process.env.AES_KEY;
// const encrypted = encryptPrivateKey(privateKeyPem, password);
// console.log("\nEncrypted Private Key (Base64):\n", encrypted);

// const decrypted = decryptPrivateKey(encrypted, password);
// console.log("\nDecrypted Private Key:\n", decrypted);
// import forge from "node-forge";

// Decrypt AES key using RSA private key

// Function to decrypt the AES key using RSA private key
export const decryptAesKeyWithRsa = (encryptedAesKeyBase64, privateKeyPem) => {
  const encryptedAesKey = forge.util.decode64(encryptedAesKeyBase64);

  const cleanedKey = privateKeyPem.replace(/\r\n/g, "\n");
  const privateKey = forge.pki.privateKeyFromPem(cleanedKey);

  const aesKey = privateKey.decrypt(encryptedAesKey, "RSA-OAEP");
  return aesKey;
};

// Function to decrypt the file using AES-GCM
export const decryptFile = ({
  encryptedFileDataBase64,
  encryptedAESKeyBase64,
  ivBase64,
  tagBase64,
  privateKeyPem,
}) => {
  // Step 1: Decode base64-encoded inputs
  const encryptedFileData = forge.util.decode64(encryptedFileDataBase64);
  const iv = forge.util.decode64(ivBase64);
  const tag = forge.util.decode64(tagBase64);

  // Step 2: Decrypt AES key using RSA private key
  const aesKey = decryptAesKeyWithRsa(encryptedAESKeyBase64, privateKeyPem);

  // Step 3: Decrypt file using AES-GCM
  const decipher = forge.cipher.createDecipher("AES-GCM", aesKey);
  decipher.start({
    iv: iv,
    tag: tag,
  });

  decipher.update(forge.util.createBuffer(encryptedFileData));
  const success = decipher.finish();

  if (!success) {
    throw new Error("Decryption failed. Tag mismatch or wrong key.");
  }

  // Step 4: Return raw bytes or a Blob depending on usage
  const decryptedBytes = decipher.output.getBytes();
  const byteArray = forge.util.createBuffer(decryptedBytes).toByteArray();

  return new Blob([new Uint8Array(byteArray)]);
};


const privateKey = ``
const encryptedAesKey = ``;

const aesKey = decryptAesKeyWithRsa(encryptedAesKey, privateKey);

const encryptedFileData = ``

const iv = ``;

const tag = ``

const getFile = async () => {
  const decryptedDataBytes = decryptFile(
          aesKey,
          encryptedFileData,
          iv,
          tag
        );
const byteArray = new Uint8Array(forge.util.createBuffer(decryptedDataBytes).toHex().match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const blob = new Blob([byteArray], { type: file.metadata.fileType || "application/octet-stream" });
const decryptedFile = new File([blob], file.metadata.fileName || "decrypted_file", {
  type: file.metadata.fileType || "application/octet-stream",
});
return decryptedFile ;
}

const file = getFile()
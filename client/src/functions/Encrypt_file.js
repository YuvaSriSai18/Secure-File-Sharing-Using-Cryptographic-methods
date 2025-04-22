// import forge from "node-forge";

// // Generate a random AES key (256-bit)
// export const generateAesKey = () => {
//   return forge.random.getBytesSync(32);
// };

// // Generate a random IV (12 bytes recommended for GCM)
// export const generateIv = () => {
//   return forge.random.getBytesSync(12);
// };

// // Encrypt the file using AES-GCM
// export const encryptFile = (fileBuffer, aesKey) => {
//   const iv = generateIv();
//   const cipher = forge.cipher.createCipher("AES-GCM", aesKey);

//   cipher.start({
//     iv: iv,
//     tagLength: 128, // 16 bytes
//   });

//   cipher.update(forge.util.createBuffer(fileBuffer));
//   cipher.finish();

//   const encrypted = cipher.output.getBytes();
//   const tag = cipher.mode.tag.getBytes();

//   return {
//     encryptedFileData: encrypted,
//     iv: iv,
//     tag:tag,
//   };
// };

// export const encryptAesKeyWithRsa = (aesKey, publicKeyPem) => {
//   if (typeof publicKeyPem !== "string") {
//     throw new Error("Public key must be a string in PEM format");
//   }
//   console.log("Public Key Pem " + publicKeyPem)
//   const cleanedKey = publicKeyPem.replace(/\r\n/g, "\n");
//   console.log("Cleaned " + publicKeyPem)

//   const publicKey = forge.pki.publicKeyFromPem(cleanedKey);
//   console.log("public key " + publicKey)
//   const encryptedKey = publicKey.encrypt(aesKey, "RSA-OAEP");
//   console.log("encrypted key" + encryptedKey)
//   return encryptedKey;
// };

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
export const encryptFileWithRsa = (fileBuffer, publicKeyPem) => {
  const aesKey = generateAesKey(); // Step 1
  const iv = generateIv();

  const cipher = forge.cipher.createCipher("AES-GCM", aesKey); // Step 2
  cipher.start({ iv: iv, tagLength: 128 });
  
  cipher.update(forge.util.createBuffer(fileBuffer));
  cipher.finish();

  const encryptedFileData = cipher.output.getBytes();
  const tag = cipher.mode.tag.getBytes();

  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem); // Step 3
  const encryptedAESKey = publicKey.encrypt(aesKey, "RSA-OAEP");

  return {
    encryptedFileDataBase64: forge.util.encode64(encryptedFileData),
    ivBase64: forge.util.encode64(iv),
    tagBase64: forge.util.encode64(tag),
    encryptedAESKeyBase64: forge.util.encode64(encryptedAESKey),
  };
};

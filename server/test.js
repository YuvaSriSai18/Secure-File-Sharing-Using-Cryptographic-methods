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


const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAkXa+zO5vWnaN7k/wMnRCQzN+IsvB+TE0pgd3OLJ9hUCacDOn
MYhd7hVVp8+ubydLAqdKwxyrgKfr2KbG2yJ/DJvEOWzUO5Ax+6E18jWDN6k/Lerw
Xt/lK3r7BihwPIdfoH0cApVmpi93rRL5tvqSQBj72yFQ7l5x5pqCk5GDDlhEY2yy
rfPAG26J7GiHOnhHpAAeV1FMbo+B5TIuqAC7+hKvvt29FqU9Gjsp1w2swrMwahbj
KDvV0OeICO7WQJrvMNWg6Ebk+nx2x6zUmp7d7K3F/SQrOvTZICre5qF1Yu1PiVlV
Tmxj7J0r0DZuc0R1/d9t2ryqeFbX0KTT5iFbAwIDAQABAoIBAEA+iiE3U03IW4H7
ozGdYCCO7vAOPrLAlSiY1oJfbol6EVtprLd3K0j5+jUdx8QGvh3DZgULNgGh6Ets
yRnCQAuBBiZ4lrlhw3mHZyx8juH36VPt1dCJIQ1ViOVc2ckZ3tWiO8s2Ubom77us
TEaQnyQZBK7wpW5JnxOCfRYQp6mfDrEGYTPtHaGCyCA8DXyZ6Pt0rEtYASHU8NuZ
TzoGwkEQIXc2jub2hErXH3CR3tQg3Tll9Buj51ch9viFYMB2hleVd1ILc81F/Tqr
NLGU6jlhN/9jnfWATDQePBDounAj0awEiZ0pd+97t5tGBgkMDtTG0W5UY4ohshs1
07+N2bUCgYEAx+0zX1ZN20PSdnsxc79xQqUZtu2KRfdVlGtTI5k0ijxvlrUltYld
tRY4xbxN2CXGL6uBCH6kZr9FCFfi9aMHIkDxPdupmw/zb53MNTXLzqqi2sPx1+WB
Kv9KAj2iGekfKelSL4XT2u47QIT9xm5icSWv+RmE4xalj+Fo+Oqcee0CgYEAukMa
HZ0Z5eXk8vgvbHNZ7oFa7sB0mDhnLu8XLSsJzX1jHKb/Bx5JMj0I+22P67J6aQg/
7x+YTQEBHvNPkiX/QRYwyWJ2FRX8XEObUFbLzMsUfVxANDM3iAFBXyRYSk4rKFQb
9AFAyI9DWynqiNCkVp9PNeC4Hkh/MCA7pd4pyq8CgYBAIfAL0iSRhLUburMHXU8Y
wNt52cM0ZH34aWE3FytKeM6W+q8JB/KeZ214yMnz31Iu8oYm0nEsYIjlf0PX5h8g
ttJsNG24xyohEO5z1zj0p7osERUgW4fO4iu8gkbgpu6PREBP7E8keK1bKg46PCiq
ARvs/WmqaxZbDETfLGtblQKBgQCK2mslmHAuCmvbFVmFJ5jrTFNVmPNSZvnE60gD
zAnKvqacPYHw9IrsgMOpa8vWkX7fvd6rjIolHZKQWCIBeYIIK1rDRjtxDKrMvTmT
cqELUnk72wGh6GyFXyo0mwuWmR9jORB9nlGFMgesdlr5E1DvomOSbqvTJ4hpgB33
UN8m0QKBgBoPnsrXcOX8QdMajrdeELV+JnhtxufeOgTt+u0giMNxxsru2C0nXrbx
76VSJwihZ8gQEvnZVT+d8bh4uqAEDomj/CrUzopowhysqpnFUbnKl6Rqrk8Riw0h
fUc/uLa4mQUWk0eQ0TwyUVd+e1X/mPOGmuRQmybhdYL9DY8m6CeL
-----END RSA PRIVATE KEY-----

`;
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
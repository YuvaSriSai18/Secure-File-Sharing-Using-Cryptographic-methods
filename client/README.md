# 🔐 Secure File Sharing System using Hybrid Encryption (AES + RSA)

This project is a **secure file sharing web application** built using **Hybrid Encryption**, combining the speed of **AES (Advanced Encryption Standard)** with the secure key distribution capabilities of **RSA (Rivest–Shamir–Adleman)**.

It ensures that files are **encrypted end-to-end**, such that **only the intended recipient** with the correct private key can decrypt and access the data — all while maintaining speed, security, and scalability.

---

## 🚀 Features

- 🔑 **Hybrid Encryption (AES + RSA)**  
  Fast encryption using AES, with secure RSA key-based exchange for AES keys.

- 🛡 **End-to-End Security**  
  Files are never stored or transmitted in plaintext. All encryption and decryption happens client-side or in-memory.

- 📁 **Supports Multiple File Types**  
  Works seamlessly with text, PDF, images, and other file formats.

- 🔒 **HTTPS-based Communication**  
  Prevents man-in-the-middle and eavesdropping attacks.

- 👤 **User Authentication**  
  Only registered users can upload and receive files securely.

---

## 🧠 How It Works

### 📥 Upload Flow:
1. User selects a file to upload.
2. A random AES key is generated to encrypt the file.
3. The AES key is encrypted with the recipient’s **RSA public key**.
4. Encrypted file + encrypted AES key are stored on the server.

### 📤 Download Flow:
1. Recipient receives the encrypted file and AES key.
2. Decrypts the AES key using their **RSA private key**.
3. Uses the decrypted AES key to decrypt the file.

---

## 🛠 Tech Stack

- **Frontend:** React JS  
- **Backend:** Node.js / Flask  
- **Cryptography:**  
  - AES-256 for file encryption  
  - RSA-2048 for key encryption  
- **Security:**  
  - HTTPS  
  - Local/private key storage  
  - Optional SHA-256 planned for integrity verification

---

## 📊 Performance Highlights

- **AES:** Extremely fast and handles large files efficiently.
- **RSA:** Slightly slower but only encrypts small AES keys, maintaining performance.
- **Hybrid Approach:** Combines speed (AES) with security (RSA) — ideal for secure file sharing over the web.

---

## 📌 Future Enhancements

- ✅ Digital Signatures for sender verification  
- ✅ SHA-256 hashing for file integrity  
- ✅ Replay attack prevention using timestamps or UUID  
- ✅ Role-Based Access Control (RBAC)  
- ✅ Cloud Key Vault integration (AWS KMS, Azure Key Vault)  
- ✅ Audit logs for access tracking  
- ✅ Multi-user shared folders  

---

## 📚 References

- William Stallings, *Cryptography and Network Security*  
- [NIST FIPS 197 – AES Standard](https://csrc.nist.gov/publications/detail/fips/197/final)  
- [RSA Cryptography Standard – PKCS #1](https://datatracker.ietf.org/doc/html/rfc8017)  
- [OpenSSL](https://www.openssl.org/)  
- [SubtleCrypto API – MDN](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)  
- [OWASP Secure Transmission Guidelines](https://owasp.org/www-project-cheat-sheets/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)

---

## 📎 License

This project is open-source and available under the [MIT License](LICENSE).

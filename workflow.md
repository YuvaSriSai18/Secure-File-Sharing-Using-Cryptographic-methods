## 🔐 **Secure File Sharing Flow (AES + RSA Hybrid Encryption)**

---

### **1. User Sign-Up / Login**
- 🟢 **On Sign-Up**:
  - 🔑 Generate **Public & Private Key Pair** (e.g., RSA-2048).
  - 🗄️ Store:
    - **Public Key** → Stored in DB (associated with the user).
    - **Private Key** → Encrypted and securely stored or downloaded by the user.

---

### **2. Uploading a File**
- 📄 User selects a file to send.
- 🔐 Generate a **Random AES-256 Key**.
- 🔒 Encrypt:
  - **File data** using AES-256.
  - (Optional) **File metadata** (e.g., name, type).
- 🔏 Encrypt the **AES Key** using the **Receiver's Public Key**.
- 🗃️ Store in DB:
  - Encrypted File Data
  - Encrypted AES Key
  - Sender and Receiver References
  - Timestamps / Metadata

---

### **3. Sending the File**
- 🚀 Transmit:
  - Encrypted File Data
  - Encrypted AES Key
  - Metadata (if not stored)

---

### **4. Receiver Accesses the File**
- 📥 Receiver fetches the file.
- 🔓 Decrypt the **AES Key** using their **Private Key**.
- 🧩 Decrypt the **File Data** using the decrypted AES Key.
- ✅ File is now available in original form.

---

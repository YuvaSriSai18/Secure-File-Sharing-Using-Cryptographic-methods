This backend system supports secure file sharing with encryption using RSA and AES-GCM. The following features and components have been fully implemented:

### 🔐 **Authentication & Authorization**
- JWT-based user authentication with middleware to protect sensitive routes.
- Middleware to decode tokens and authorize user access.

### 📦 **Secure File Upload**
- Files are encrypted on upload using AES-256 in GCM mode (ensuring confidentiality and integrity).
- AES key is generated per file and encrypted using the receiver’s RSA public key.
- Encrypted file data and AES key are stored in MongoDB.

### 📥 **Secure File Download**
- Receiver can decrypt the file using their RSA private key (protected with a password).
- File content is decrypted using AES-GCM with authentication tag verification.

### 🔑 **Key Management**
- RSA key pair (2048-bit) is generated for each user.
- Public key is stored in plain PEM format.
- Private key is stored encrypted using the user's password.

### 📄 **File Metadata Handling**
- File metadata (name, type, sender, receiver, etc.) is stored and retrievable.
- Option to mark files as downloaded (for auditing purposes).

### 📂 **User File Management**
- API to fetch all files sent or received by the logged-in user.
- Relationship mapping between users and shared files using Mongoose references.

### 🛠️ **Encryption Utilities**
- Utility functions built for AES-GCM encryption/decryption.
- Utility for encrypting and decrypting AES keys using RSA.
- Node-forge used for robust cryptographic operations.

---

### 📘 API Endpoints

| **Method** | **Endpoint**                  | **Purpose**                                           | **Auth Token Required** |
|------------|-------------------------------|--------------------------------------------------------|--------------------------|
| `POST`     | `/api/auth/register`          | Register a new user and generate RSA key pair          | ❌ No                   |
| `POST`     | `/api/auth/login`             | Authenticate user and return JWT                       | ❌ No                   |
| `GET`      | `/api/files/my-files`         | Fetch all files sent or received by the user           | ✅ Yes                  |
| `POST`     | `/api/files/upload`           | Upload and encrypt a file to a specific user           | ✅ Yes                  |
| `POST`     | `/api/files/download`         | Decrypt and download a file using receiver's key       | ✅ Yes                  |
| `POST`     | `/api/files/mark-downloaded/:fileId` | Mark a file as downloaded                         | ✅ Yes                  |

---

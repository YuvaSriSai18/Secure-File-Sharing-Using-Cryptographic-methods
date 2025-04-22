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
Here’s a clean summary of all the APIs you’ve listed in your Postman collection, formatted in a table:

---

### 📦 **Crypto API Endpoints**

| **Name**                 | **Method** | **Endpoint**                                                       | **Description**                               |
|--------------------------|------------|--------------------------------------------------------------------|------------------------------------------------|
| **Sign Up**              | `POST`     | `/api/auth/signup`                                                | Registers a new user                          |
| **Login**                | `POST`     | `/api/auth/login`                                                 | Authenticates a user and returns a token      |
| **GET_PUBLIC_KEY**       | `GET`      | `/api/auth/public-key/:userId`                                    | Gets the public RSA key of a user             |
| **get_Encrypted_PrivateKey** | `GET`  | `/api/auth/private-key/:userId`                                   | Gets the encrypted private key of a user      |
| **GET_USERS**            | `GET`      | `/api/auth/users`                                                 | Retrieves all registered users                |
| **GET_RECEIVED_FILES**   | `GET`      | `/api/files/my-files/:userId`                                     | Fetches files received by the user            |
| **POST_MESSAGE (Upload)**| `POST`     | `/api/files/upload`                                               | Uploads encrypted file data and metadata      |
| **TEST**                 | `GET`      | `/test`                                                            | Test route (likely for backend verification)  |

---
import React, { useState, useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import forge from "node-forge";
import {
  encryptFileWithRsa,
  generateAesKey,
  generateIv,
} from "../functions/Encrypt_file"; // Import functions for AES and RSA encryption
import * as API from "../apis/index"; // Import API calls

export default function File_Upload({ onFilesEncrypted, receiverId }) {
  const [rsaPublicKeyPem, setRsaPublicKeyPem] = useState(""); // Public key for encryption
  const [uploadedFiles, setUploadedFiles] = useState([]); // Files being uploaded
  const [loadingKey, setLoadingKey] = useState(true); // Loading state for public key

  // Fetch the public RSA key from the server when receiverId changes
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getPublicKey = async () => {
      try {
        const res = await API.getPublicKey(receiverId, token);
        if (!res.data.publicKey) {
          throw new Error("retrieving receiver public key failed");
        }
        const pem = res.data?.publicKey; // Handle response format
        console.log(`Receiver's Public Key: ${pem}`);
        setRsaPublicKeyPem(pem);
      } catch (err) {
        console.log("Error fetching public key:", err);
      } finally {
        setLoadingKey(false);
      }
    };

    if (receiverId) {
      setLoadingKey(true); // Show loading state while fetching the key
      getPublicKey();
    }
  }, [receiverId]);

  // Handle file uploads and encryption
  const onUploadHandler = async ({ files }) => {
    if (!rsaPublicKeyPem) {
      console.warn("RSA public key not available yet.");
      return;
    }

    const limitedFiles = Array.from(files).slice(0, 4); // Limit to 4 files
    const uniqueFiles = limitedFiles.filter(
      (file) =>
        !uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)
    );

    if (uniqueFiles.length === 0) return;

    const processedPayloads = [];

    for (const file of uniqueFiles) {
      const newFile = { ...file, status: "pending" };
      setUploadedFiles((prev) => [...prev, newFile]);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const fileBytes = forge.util.createBuffer(arrayBuffer).getBytes();

        const {
          encryptedFileDataBase64,
          ivBase64,
          tagBase64,
          encryptedAESKeyBase64,
        } = encryptFileWithRsa(fileBytes, rsaPublicKeyPem);

        const payload = {
          encryptedFileData: encryptedFileDataBase64,
          encryptedAESKey: encryptedAESKeyBase64,
          iv: ivBase64,
          tag: tagBase64,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          },
        };

        processedPayloads.push(payload);

        // Mark the file as uploaded (completed)
        const updatedFile = { ...newFile, status: "completed" };
        setUploadedFiles((prevFiles) =>
          prevFiles.map((f) => (f.name === file.name ? updatedFile : f))
        );
      } catch (error) {
        console.error("Error processing file:", file.name, error);
      }
    }

    // Call the callback to notify the parent component with the encrypted files
    if (onFilesEncrypted) {
      onFilesEncrypted(processedPayloads);
    }
  };

  return (
    <div className="card">
      <FileUpload
        name="files"
        multiple
        accept="*"
        maxFileSize={1000000} // Set the maximum file size to 1MB (adjust as needed)
        customUpload
        uploadHandler={onUploadHandler}
        files={uploadedFiles}
        emptyTemplate={
          <p className="m-0">
            Drag and drop up to 4 files to encrypt and attach.
          </p>
        }
        chooseLabel="Choose"
        disabled={uploadedFiles.length > 0 || loadingKey} // Disable upload if files are already uploaded or if key is loading
      />
    </div>
  );
}

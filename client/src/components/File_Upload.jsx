import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import forge from "node-forge";
import {
  generateAesKey,
  encryptFile,
  encryptAesKeyWithRsa,
} from "../functions/Encrypt_file";

export default function File_Upload({ onFilesEncrypted }) {
  const rsaPublicKeyPem = localStorage.getItem("publicKey");

  const [uploadedFiles, setUploadedFiles] = useState([]); // Track the files being uploaded

  const onUploadHandler = async ({ files }) => {
    const limitedFiles = Array.from(files).slice(0, 4); // Limit to 4 files
    const processedPayloads = [];

    // Check for duplicate files based on file name
    const uniqueFiles = limitedFiles.filter(
      (file) =>
        !uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)
    );

    if (uniqueFiles.length === 0) {
      // If no unique files, return early (no action)
      return;
    }

    // Process each unique file
    for (const file of uniqueFiles) {
      // Add file to the uploaded list with a status 'pending'
      const newFile = { ...file, status: "pending" };
      setUploadedFiles((prevFiles) => [...prevFiles, newFile]);

      // Convert the file into an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const fileBytes = forge.util.createBuffer(arrayBuffer).getBytes();

      // Generate AES key and encrypt the file with it
      const aesKey = generateAesKey();
      const { encryptedFileData, iv, tag } = encryptFile(fileBytes, aesKey);

      // Encrypt the AES key with RSA
      const encryptedAESKey = encryptAesKeyWithRsa(aesKey, rsaPublicKeyPem);

      // Create a payload object containing the encrypted data
      const payload = {
        encryptedFileData, // The encrypted file data
        encryptedAESKey, // The RSA encrypted AES key
        iv, // The IV used for AES encryption
        tag, // The tag for AES encryption
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        },
      };
      processedPayloads.push(payload);

      // Update the file status to completed
      const updatedFile = { ...newFile, status: "completed" }; // Set status to 'completed'
      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) => (f.name === file.name ? updatedFile : f))
      );
    }

    // Pass the encrypted payloads back to the parent component
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
        maxFileSize={1000000}
        customUpload
        uploadHandler={onUploadHandler}
        files={uploadedFiles} // Display all uploaded files
        emptyTemplate={
          <p className="m-0">
            Drag and drop up to 4 files to encrypt and attach.
          </p>
        }
        chooseLabel="Choose"
        // Disable upload button when files are uploaded to the encrypted payloads
        disabled={uploadedFiles.length > 0} // Disable upload button after files are uploaded
      />
    </div>
  );
}

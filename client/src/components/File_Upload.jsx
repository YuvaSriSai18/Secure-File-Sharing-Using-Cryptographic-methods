import React, { useState, useEffect } from "react";
import { FileUpload } from "primereact/fileupload";
import forge from "node-forge";
import {
  generateAesKey,
  encryptFile,
  encryptAesKeyWithRsa,
} from "../functions/Encrypt_file";
import * as API from "../apis/index";

export default function File_Upload({ onFilesEncrypted, receiverId }) {
  const [rsaPublicKeyPem, setRsaPublicKeyPem] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingKey, setLoadingKey] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getPublicKey = async () => {
      try {
        const res = await API.getPublicKey(receiverId, token);
        const pem = res.data?.publicKey || res.data; // handles both object and string
        setRsaPublicKeyPem(pem);
      } catch (err) {
        console.log("Error fetching public key:", err);
      } finally {
        setLoadingKey(false);
      }
    };

    if (receiverId) {
      setLoadingKey(true); // ensure loading shows correctly for multiple receiverId changes
      getPublicKey();
    }
  }, [receiverId]);

  const onUploadHandler = async ({ files }) => {
    if (!rsaPublicKeyPem) {
      console.warn("RSA public key not available yet.");
      return;
    }

    const limitedFiles = Array.from(files).slice(0, 4);
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

        const aesKey = generateAesKey();
        const { encryptedFileData, iv, tag } = encryptFile(fileBytes, aesKey);
        const encryptedAESKey = encryptAesKeyWithRsa(aesKey, rsaPublicKeyPem);

        const payload = {
          encryptedFileData: forge.util.encode64(encryptedFileData),
          encryptedAESKey: forge.util.encode64(encryptedAESKey),
          iv: forge.util.encode64(iv),
          tag: forge.util.encode64(tag),
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          },
        };

        processedPayloads.push(payload);

        const updatedFile = { ...newFile, status: "completed" };
        setUploadedFiles((prevFiles) =>
          prevFiles.map((f) => (f.name === file.name ? updatedFile : f))
        );
      } catch (error) {
        console.error("Error processing file:", file.name, error);
      }
    }

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
        files={uploadedFiles}
        emptyTemplate={
          <p className="m-0">
            Drag and drop up to 4 files to encrypt and attach.
          </p>
        }
        chooseLabel="Choose"
        disabled={uploadedFiles.length > 0 || loadingKey}
      />
    </div>
  );
}

import React from "react";
import { FileUpload } from "primereact/fileupload";
import forge from "node-forge";
import {
  generateAesKey,
  encryptFile,
  encryptAesKeyWithRsa,
} from "../functions/Encrypt_file";
export default function Home() {
  const rsaPublicKeyPem = localStorage.getItem("publicKey");
  const onUploadHandler = async ({ files }) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const fileBytes = forge.util.createBuffer(arrayBuffer).getBytes();

      const aesKey = generateAesKey();
      const { encryptedData, iv, tag } = encryptFile(fileBytes, aesKey);

      const encryptedKey = encryptAesKeyWithRsa(aesKey, rsaPublicKeyPem);

      await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          encryptedData,
          iv,
          tag,
          encryptedKey,
        }),
      });

      console.log("File uploaded and encrypted successfully.");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <FileUpload
        mode="basic"
        name="file"
        accept="*"
        maxFileSize={1000000}
        customUpload
        uploadHandler={onUploadHandler}
      />
    </div>
  );
}

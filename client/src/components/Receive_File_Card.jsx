import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import {
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaLock,
} from "react-icons/fa";
import { decryptAndDownloadFile } from "../functions/Decrypt_File";// Your full decrypt/download util

export default function Receive_File_Card({ fileItem }) {
  const [error, setError] = useState(null);

  const getFileIconByType = (mimeType = "") => {
    const type = mimeType.toLowerCase();
    if (type.includes("image")) return <FaFileImage className="text-green-600 text-xl" />;
    if (type.includes("pdf")) return <FaFilePdf className="text-red-600 text-xl" />;
    if (type.includes("word")) return <FaFileWord className="text-blue-600 text-xl" />;
    if (type.includes("excel")) return <FaFileExcel className="text-green-800 text-xl" />;
    if (type.includes("zip") || type.includes("rar")) return <FaFileArchive className="text-yellow-600 text-xl" />;
    if (type.includes("text") || type.includes("plain")) return <FaFileAlt className="text-gray-600 text-xl" />;
    return <FaFileAlt className="text-gray-500 text-xl" />;
  };

  const handleDecryptAndDownload = async (file) => {
    const privateKey = localStorage.getItem("privateKey");

    if (!privateKey) {
      setError("Private key not found in localStorage.");
      return;
    }

    try {
      await decryptAndDownloadFile({
        encryptedFileData: file.encryptedFileData,
        encryptedAESKey: file.encryptedAESKey,
        iv: file.iv,
        tag: file.tag,
        metadata: file.metadata,
        rsaPrivateKeyPem: privateKey,
      });
    } catch (err) {
      setError("Decryption or download failed.");
      console.error("Error during decrypt & download:", err);
    }
  };

  return (
    <div className="w-full">
      <Card
        title={
          <div className="text-lg font-semibold">
            From: <span className="text-blue-800">{fileItem.sender.name}</span>
          </div>
        }
        subTitle={<span className="text-sm text-gray-500">{fileItem.sender.email}</span>}
        className="shadow-md rounded-2xl border border-gray-200 mb-6 transition hover:shadow-xl"
      >
        <div className="text-sm text-gray-500 mb-2">
          Received{" "}
          {formatDistanceToNow(new Date(fileItem.createdAt), {
            addSuffix: true,
          })}
        </div>

        <p className="text-base mb-3">
          <span className="font-medium">Message:</span>{" "}
          <span className="text-gray-700 italic">{fileItem.message}</span>
        </p>

        <div className="bg-gray-100 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
            <FaLock /> Encrypted Files:
          </h4>

          <div className="space-y-3">
            {fileItem.files.map((file, idx) => {
              const fileType = file?.metadata?.fileType || "application/octet-stream";

              return (
                <div
                  key={file._id}
                  className="flex items-start gap-3 p-2 bg-white rounded-md border border-gray-200 shadow-sm justify-between"
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getFileIconByType(fileType)}</div>
                    <div className="text-sm">
                      <p className="font-medium">
                        {file.metadata?.fileName || `File ${idx + 1}`}
                      </p>
                      <p className="text-gray-400 italic">Encrypted</p>
                    </div>
                  </div>
                  <Button
                    label="Decrypt & Download"
                    icon="pi pi-download"
                    className="p-button-sm p-button-success"
                    onClick={() => handleDecryptAndDownload(file)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  );
}

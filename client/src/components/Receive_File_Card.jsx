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

export default function Receive_File_Card({ fileItem }) {
  const [showDecrypted, setShowDecrypted] = useState(false);

  // Function to return icon based on file type (MIME type)
  const getFileIconByType = (mimeType = "") => {
    const type = mimeType.toLowerCase();

    if (type.includes("image")) return <FaFileImage className="text-green-600 text-xl" />;
    if (type.includes("pdf")) return <FaFilePdf className="text-red-600 text-xl" />;
    if (type.includes("word")) return <FaFileWord className="text-blue-600 text-xl" />;
    if (type.includes("excel")) return <FaFileExcel className="text-green-800 text-xl" />;
    if (type.includes("zip") || type.includes("rar")) return <FaFileArchive className="text-yellow-600 text-xl" />;
    if (type.includes("text") || type.includes("plain")) return <FaFileAlt className="text-gray-600 text-xl" />;
    
    return <FaFileAlt className="text-gray-500 text-xl" />; // default generic file icon
  };

  return (
    <div className="w-full">
      <Card
        title={
          <div className="text-lg font-semibold">
            From: <span className="text-blue-800">{fileItem.sender.name}</span>
          </div>
        }
        subTitle={
          <span className="text-sm text-gray-500">{fileItem.sender.email}</span>
        }
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
                  className="flex items-start gap-3 p-2 bg-white rounded-md border border-gray-200 shadow-sm"
                >
                  <div className="mt-1">{getFileIconByType(fileType)}</div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">
                      {file.metadata?.fileName || `File ${idx + 1}`}
                    </p>
                    {!showDecrypted ? (
                      <p className="text-gray-400 italic">Encrypted</p>
                    ) : (
                      <div className="text-xs text-gray-600 space-y-1 break-words">
                        <p>
                          <span className="font-semibold">Type:</span>{" "}
                          {fileType.toUpperCase()}
                        </p>
                        <p>
                          <span className="font-semibold">AES Key:</span>{" "}
                          {file.encryptedAESKey?.slice(0, 40)}...
                        </p>
                        <p>
                          <span className="font-semibold">IV:</span> {file.iv}
                        </p>
                        <p>
                          <span className="font-semibold">Tag:</span> {file.tag}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            label={showDecrypted ? "Hide Details" : "Decrypt"}
            icon={showDecrypted ? "pi pi-eye-slash" : "pi pi-lock-open"}
            className="p-button-sm"
            onClick={() => setShowDecrypted((prev) => !prev)}
          />
        </div>
      </Card>
    </div>
  );
}

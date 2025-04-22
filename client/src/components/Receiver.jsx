import React, { useState, useRef, useEffect } from "react";
import * as API from "../apis/index";
import ToastComponent from "../components/ToastComponent";

import Receive_File_Card from "./Receive_File_Card";

export default function Receiver() {
  const [ReceivedFiles, setReceivedFiles] = useState([]);
  const toastRef = useRef(null);

  const getReceivedFiles = async () => {
    const token = localStorage.getItem("accessToken");

    await API.getReceivedFiles(token)
      .then((res) => {
        setReceivedFiles(res.data.files); // ← updated to use res.data.files
        toastRef.current.showToast({
          severity: "success",
          summary: "Messages Fetched Successfully",
          detail: "Fetched all received messages",
        });
      })
      .catch((err) => {
        toastRef.current.showToast({
          severity: "warn",
          summary: "Error in Fetching Messages",
          detail: err.response?.data?.message || "Something went wrong",
        });
      });
  };

  useEffect(() => {
    getReceivedFiles();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen  w-5/6 m-auto rounded-lg mt-10">
      <ToastComponent ref={toastRef} />
      <h2 className="text-2xl font-semibold mb-4">Received Files</h2>
      {ReceivedFiles.length === 0 ? (
        <p className="text-gray-500">No files received yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ReceivedFiles.map((fileItem) => (
            <Receive_File_Card fileItem={fileItem} key={fileItem._id} />
          ))}
        </div>
      )}
    </div>
  );
}

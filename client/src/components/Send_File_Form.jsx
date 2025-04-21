import React, { useState, useEffect, useRef } from "react";
import File_Upload from "../components/File_Upload";
import Select_Receiver from "./Select_Receiver";
import Input_Component from "../components/Input_Component";
import * as API from "../apis/index";
import ToastComponent from "../components/ToastComponent";

export default function Send_File_Form() {
  const [selectedUser, setSelectedUser] = useState(null);
  const toastRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const [message, setMessage] = useState({
    sender: user?.userId || "",
    receiver: "",
    message: "",
    files: [],
  });

  useEffect(() => {
    if (selectedUser) {
      setMessage((prev) => ({
        ...prev,
        receiver: selectedUser._id,
      }));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      console.log("Selected User:", selectedUser);
    }
  }, [selectedUser]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleTextChange = (e) => {
    setMessage((prev) => ({
      ...prev,
      message: e.target.value,
    }));
  };

  const handleEncryptedFiles = (encryptedPayloads) => {
    setMessage((prev) => ({
      ...prev,
      files: encryptedPayloads,
    }));
  };

  const Submit = async () => {
    console.log("Submitting message:", message);
    await API.uploadMessage(message)
      .then((res) => {
        toastRef.current.showToast({
          severity: "success",
          summary: "Message Sent Successfully",
          detail: res.data.message,
        });
        setMessage({
          sender: user?.userId || "",
          receiver: selectedUser?._id || "",
          message: "",
          files: [],
        });
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Unknown error";
        toastRef.current.showToast({
          severity: "error",
          summary: "Error in sending message",
          detail: errorMessage,
        });
      });
  };

  return (
    <div className="p-4 space-y-4 border w-5/6 m-auto rounded-lg mt-10">
      <ToastComponent ref={toastRef} />
      <Select_Receiver onUserSelect={handleUserSelect} />
      <Input_Component
        value={message.message}
        onChange={handleTextChange}
        placeholder="Type your message here..."
        className="w-full"
      />

      <File_Upload
        key={selectedUser?._id} // Reset when user changes
        onFilesEncrypted={handleEncryptedFiles}
        receiverId={selectedUser?._id}
      />

      {selectedUser && (
        <div className="bg-gray-100 p-3 rounded-md">
          <p>
            <strong>Receiver:</strong> {selectedUser.name}
          </p>
          <pre className="text-sm bg-white p-2 rounded overflow-auto">
            {JSON.stringify(message, null, 2)}
          </pre>
        </div>
      )}

      <button
        disabled={!selectedUser || (!message.message && message.files.length === 0)}
        className={`${
          !selectedUser || (!message.message && message.files.length === 0)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        } text-white px-4 py-2 rounded-md transition`}
        onClick={Submit}
      >
        Submit
      </button>
    </div>
  );
}

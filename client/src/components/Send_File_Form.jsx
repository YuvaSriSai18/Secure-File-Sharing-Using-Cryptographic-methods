import React, { useState, useEffect } from "react";
import File_Upload from "../components/File_Upload";
import Receiver from "../components/Receiver";
import Input_Component from "../components/Input_Component";

export default function Send_File_Form() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    console.log(selectedUser);
  };

  let user = JSON.parse(localStorage.getItem("user"));

  const [Message, setMessage] = useState({
    sender: user?.userId || "",
    receiver: selectedUser?._id || "",
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
  const Submit = () => {
    console.log(Message);
  };
  return (
    <div className="p-4 space-y-4 border w-5/6 m-auto rounded-lg mt-10">
      <Receiver onUserSelect={handleUserSelect} />

      <Input_Component
        value={Message.message}
        onChange={handleTextChange}
        placeholder="Type your message here..."
        className="w-full"
      />

      <File_Upload onFilesEncrypted={handleEncryptedFiles} />

      {selectedUser && (
        <div>
          <p>
            <strong>Receiver:</strong> {selectedUser.name}
          </p>
          <pre>{JSON.stringify(Message, null, 2)}</pre>
        </div>
      )}
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        onClick={Submit}
      >
        Submit
      </button>
    </div>
  );
}

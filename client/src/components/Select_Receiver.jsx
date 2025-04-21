// Receiver.jsx
import React, { useState, useRef, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import ToastComponent from "./ToastComponent";
import * as API from "../apis/index";

export default function Select_Receiver({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const toastRef = useRef(null);

  const getUsers = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const res = await API.getUsers(token);
      setUsers(res.data);
    } catch (err) {
      toastRef.current.showToast({
        severity: "error",
        summary: "Fetch Failed",
        detail: err.response?.data?.msg || "Something went wrong",
      });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleUserChange = (e) => {
    setSelectedUser(e.value);
    onUserSelect?.(e.value); // call parent's callback if it exists
  };

  const selectedUserTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center gap-2">
          <div
            className="bg-primary text-white border-circle flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
          >
            <span style={{ fontWeight: "bold" }}>
              {option.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-column">
            <span className="font-medium">{option.name}</span>
            <small className="text-color-secondary">{option.email}</small>
          </div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const userOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-2 p-2">
        <div
          className="bg-primary text-white border-circle flex align-items-center justify-content-center"
          style={{ width: "32px", height: "32px" }}
        >
          <span
            className="text-black bg-gray-200 rounded-full font-bold"
            style={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {option.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-column">
          <span className="font-medium">{option.name}</span>
          <small className="text-color-secondary">{option.email}</small>
        </div>
      </div>
    );
  };

  return (
    <div className="card flex justify-content-center">
      <ToastComponent ref={toastRef} />
      <Dropdown
        value={selectedUser}
        onChange={handleUserChange}
        options={users}
        optionLabel="name"
        placeholder="Select a User"
        filter
        filterBy="name,email"
        valueTemplate={selectedUserTemplate}
        itemTemplate={userOptionTemplate}
        className="w-full md:w-14rem"
      />
    </div>
  );
}

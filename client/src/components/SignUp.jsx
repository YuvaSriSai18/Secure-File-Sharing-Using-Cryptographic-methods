import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import * as API from "../apis/index";
import ToastComponent from "../components/ToastComponent";

export default function SignUp() {
  const [User, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toastRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!User.name || !User.email || !User.password) {
      toastRef.current.showToast({
        severity: "warn",
        summary: "Missing Fields",
        detail: "Please fill in all the fields.",
      });
      return;
    }

    try {
      const res = await API.registerUser(User);

      toastRef.current.showToast({
        severity: "success",
        summary: "Registration Successful",
        detail: res.data.message,
      });

      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toastRef.current.showToast({
        severity: "error",
        summary: "Registration Failed",
        detail:
          err.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="p-6 rounded-md shadow-md bg-white text-black max-w-md mx-auto">
      <ToastComponent ref={toastRef} />
      {/* <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2> */}

      <div className="mb-4">
        <InputText
          value={User.name}
          name="name"
          placeholder="Full Name"
          onChange={handleInputChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <InputText
          value={User.email}
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <Password
          value={User.password}
          name="password"
          onChange={handleInputChange}
          placeholder="Password"
          className="w-full"
          toggleMask
        />
      </div>

      <div className="flex justify-center">
        <Button label="Register" className="w-full" onClick={handleSubmit} />
      </div>
    </div>
  );
}

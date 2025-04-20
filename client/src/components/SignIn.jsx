import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import decryptPrivateKey from "../functions/Decrypt_Private_Key";
import * as API from "../apis/index";
import ToastComponent from "../components/ToastComponent";

export default function SignIn() {
  const [User, setUser] = useState({
    email: "",
    password: "",
  });

  const toastRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!User.email || !User.password) {
      toastRef.current.showToast({
        severity: "warn",
        summary: "Missing Fields",
        detail: "Please enter both email and password.",
      });
      return;
    }

    try {
      const res = await API.loginUser(User);
      const token = res.data.token;

      // Save token and decoded user
      localStorage.setItem("accessToken", token);
      const decoded = jwtDecode(token);
      localStorage.setItem("user", JSON.stringify(decoded));

      await API.getPublicKey(decoded.userId, token)
        .then((res) => {
          localStorage.setItem("publicKey", res.data.publicKey);
          toastRef.current.showToast({
            severity: "success",
            summary: "Public Key Fetched",
            detail: res.data.msg,
          });
        })
        .catch((err) => {
          toastRef.current.showToast({
            severity: "warn",
            summary: "Error in Fetching Public Key",
            detail: err.response?.data?.msg || "Something went wrong",
          });
        });

      await API.getPrivateKey(decoded.userId, token)
        .then((res) => {
          const privateKey = decryptPrivateKey(res.data.encryptedPrivateKey);
          localStorage.setItem("privateKey", privateKey);
          toastRef.current.showToast({
            severity: "success",
            summary: "Private Key Fetched",
            detail: res.data.msg,
          });
        })
        .catch((err) => {
          toastRef.current.showToast({
            severity: "warn",
            summary: "Error in Fetching Private Key",
            detail: err.response?.data?.msg || "Something went wrong",
          });
        });

      toastRef.current.showToast({
        severity: "success",
        summary: "Login Successful",
        detail: res.data.msg,
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      toastRef.current.showToast({
        severity: "error",
        summary: "Login Failed",
        detail: err.response?.data?.msg || "Something went wrong",
      });
    }
  };

  return (
    <div className="p-6 rounded-md shadow-md bg-white text-black max-w-md mx-auto">
      <ToastComponent ref={toastRef} />
      {/* <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2> */}

      <div className="mb-4">
        <InputText
          value={User.email}
          name="email"
          placeholder="E-Mail"
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
          feedback={false}
        />
      </div>

      <div className="flex justify-center">
        <Button label="Submit" className="w-full" onClick={handleSubmit} />
      </div>
    </div>
  );
}

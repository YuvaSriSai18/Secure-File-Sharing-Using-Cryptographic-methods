import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Home from "./pages/Home";

export default function AllRoutes() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
      <Route
        path="/auth"
        element={!user ? <Authentication /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

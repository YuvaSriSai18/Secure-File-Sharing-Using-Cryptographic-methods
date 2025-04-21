import axios from "axios";

const API = axios.create({
  baseURL: `http://localhost:5500`,
});

export const registerUser = async (userData) =>
  await API.post("/api/auth/signup", userData);

export const loginUser = async (userData) =>
  await API.post("/api/auth/login", userData);

export const getUsers = async (token) =>
  await API.get("/api/auth/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getPublicKey = async (userId, token) =>
  await API.get(`/api/auth/public-key/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getPrivateKey = async (userId, token) =>
  await API.get(`/api/auth/private-key/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getReceivedFiles = async (token) =>
  await API.get("api/files/my-files/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

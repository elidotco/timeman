import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api", // Backend API URL
  withCredentials: true, // Important for sending cookies with requests
});

export default api;

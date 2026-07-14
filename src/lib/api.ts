import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// প্রতিটা request পাঠানোর আগে localStorage থেকে token নিয়ে
// Authorization header-এ বসিয়ে দিই — তাই protected route গুলো নিজে থেকেই কাজ করে।
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

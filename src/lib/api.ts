import axios from "axios";

// Production-এ Vercel-এর env var থেকে backend URL নিই;
// env না থাকলে local dev-এর জন্য localhost fallback।
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
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

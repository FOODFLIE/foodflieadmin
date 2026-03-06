// src/services/apiClient.js
import axios from "axios";
import { getFlieOptions } from "./flieUtils";
const flies = getFlieOptions();
const API_URL = flies.base_url;

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const role = localStorage.getItem("role");
    const token =
      role === "rider"
        ? localStorage.getItem("riderToken")
        : localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor (Optional)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Network error (no response from server)
    if (!error.response) {
      console.error("❌ Network Error - Backend not reachable:", {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    } else {
      // API responded with error
      console.error("❌ API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    }

    // Suppress 401 errors as they are handled by session logic
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
    }

    return Promise.reject(error);
  },
);

export default apiClient;

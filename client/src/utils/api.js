import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // or your backend URL
});

// ✅ Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Keep your existing response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", {
        status: error.response.status,
        data: error.response.data,
      });
      return Promise.reject({
        message: error.response.data.error || "Request failed",
        status: error.response.status,
      });
    } else if (error.request) {
      console.error("Network Error:", error.request);
      return Promise.reject({ message: "Network error" });
    } else {
      console.error("Request Error:", error.message);
      return Promise.reject(error);
    }
  }
);

export default api;

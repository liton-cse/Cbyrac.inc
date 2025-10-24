// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://10.10.7.102:8000/api/v1",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // must be raw JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

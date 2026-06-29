import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v1",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexora_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nexora_token");
    }
    return Promise.reject(error);
  }
);

export default api;

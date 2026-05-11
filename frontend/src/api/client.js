import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL =
  configuredBaseUrl ||
  (import.meta.env.DEV ? "http://localhost:8000/api/v1" : null);

if (!API_BASE_URL) {
  throw new Error(
    "Missing VITE_API_BASE_URL in production. Set it in your frontend deployment environment.",
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userApi = {
  register: (data) => api.post("/user", data),
  login: (data) => api.post("/user/login", data),
  verifyOTP: (data) => api.post("/user/verify-otp", data),
  resendOTP: (data) => api.post("/user/resend-otp", data),
  forgotPassword: (data) => api.post("/user/forgot-password", data),
  resetPassword: (data) => api.post("/user/reset-password", data),
  updateProfile: (data) => api.put("/user/update", data),
  deleteAccount: (data) => api.delete("/user/delete", { data }),
};

export const bookApi = {
  getAll: (params) => api.get("/book", { params }),
  getById: (id) => api.get(`/book/${id}`),
  create: (data) =>
    api.post("/book", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    api.put(`/book/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/book/${id}`),
};

export const authorApi = {
  getAll: (params) => api.get("/author", { params }),
  getById: (id) => api.get(`/author/${id}`),
  create: (data) => api.post("/author", data),
  update: (id, data) => api.put(`/author/${id}`, data),
  delete: (id) => api.delete(`/author/${id}`),
  restore: (id) => api.post(`/author/restore/${id}`),
};

export default api;

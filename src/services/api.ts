import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ApiError } from "../types";

// Create an axios instance with default configs
const api = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://lookforjob.naufalsidiq.xyz/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Only redirect if not on auth pages
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }

    // Enhanced error handling for validation errors (422)
    if (error.response?.status === 422) {
      console.error("Validation errors:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/login", { email, password }),

  register: (formData: FormData) =>
    api.post("/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }),

  logout: () => api.post("/logout"),

  getProfile: () => api.get("/profile"),

  updateProfile: (formData: FormData) =>
    api.post("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }),
};

// CV API
export const cvAPI = {
  getCV: () => api.get("/cv"),

  updateCV: (isi_cv: string) => api.post("/cv", { isi_cv }),

  generateCV: () => api.post("/cv/generate"),

  exportCV: () => api.get("/cv/export", { responseType: "blob" }),

  previewCV: () => api.get("/cv/preview", { responseType: "blob" }),

  matchJobs: () => api.post("/cv/match-jobs"),
};

// Experience API
export const experienceAPI = {
  getAll: () => api.get("/pengalaman"),

  getById: (id: number) => api.get(`/pengalaman/${id}`),

  create: (data: any) => api.post("/pengalaman", data),

  update: (id: number, data: any) => api.put(`/pengalaman/${id}`, data),

  delete: (id: number) => api.delete(`/pengalaman/${id}`),
};

// Education API
export const educationAPI = {
  getAll: () => api.get("/pendidikan"),

  getById: (id: number) => api.get(`/pendidikan/${id}`),

  create: (data: any) => api.post("/pendidikan", data),

  update: (id: number, data: any) => api.put(`/pendidikan/${id}`, data),

  delete: (id: number) => api.delete(`/pendidikan/${id}`),
};

// Skill API
export const skillAPI = {
  getAll: () => api.get("/skills"),

  getById: (id: number) => api.get(`/skills/${id}`),

  create: (formData: FormData) =>
    api.post("/skills", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  update: (id: number, formData: FormData) =>
    api.post(`/skills/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  delete: (id: number) => api.delete(`/skills/${id}`),
};

// Jobs API (scraped jobs)
export const jobsAPI = {
  getAll: (params?: any) => api.get('/jobs', { params }),
  getById: (id: number) => api.get(`/jobs/${id}`),
};

export default api;

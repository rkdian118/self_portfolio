// src/services/api.ts
import axios, { AxiosResponse } from "axios";
import {
  Hero,
  Technology,
  Project,
  Experience,
  Education,
  Contact,
  ContactForm,
  ApiResponse,
  DashboardStats,
  FileUploadResponse,
} from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminAuth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  // Authentication
  login: (
    email: string,
    password: string
  ): Promise<AxiosResponse<ApiResponse<{ tokens: { accessToken: string; refreshToken: string }; admin: any }>>> =>
    api.post("/auth/login", { email, password }),

  logout: (): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.post("/auth/logout"),

  verifyToken: (): Promise<AxiosResponse<ApiResponse<{ user: any }>>> =>
    api.get("/auth/verify"),

  // Dashboard
  getDashboardStats: (): Promise<AxiosResponse<ApiResponse<DashboardStats>>> =>
    api.get("/auth/dashboard-stats"),

  // Hero APIs
  getHero: (): Promise<AxiosResponse<ApiResponse<{ hero: Hero }>>> =>
    api.get("/hero"),

  updateHero: (
    data: Partial<Hero>
  ): Promise<AxiosResponse<ApiResponse<{ hero: Hero }>>> =>
    api.put("/hero", data),

  // Technologies APIs
  getTechnologies: (): Promise<
    AxiosResponse<ApiResponse<{ technologies: Technology[] }>>
  > => api.get("/technologies"),

  createTechnology: (
    data: Omit<Technology, "_id" | "createdAt" | "updatedAt">
  ): Promise<AxiosResponse<ApiResponse<{ technology: Technology }>>> =>
    api.post("/technologies", data),

  updateTechnology: (
    id: string,
    data: Partial<Technology>
  ): Promise<AxiosResponse<ApiResponse<{ technology: Technology }>>> =>
    api.put(`/technologies/${id}`, data),

  deleteTechnology: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/technologies/${id}`),

  // Projects APIs
  getProjects: (): Promise<
    AxiosResponse<ApiResponse<{ projects: Project[] }>>
  > => api.get("/projects"),

  createProject: (
    data: Omit<Project, "_id" | "createdAt" | "updatedAt">
  ): Promise<AxiosResponse<ApiResponse<{ project: Project }>>> =>
    api.post("/projects", data),

  updateProject: (
    id: string,
    data: Partial<Project>
  ): Promise<AxiosResponse<ApiResponse<{ project: Project }>>> =>
    api.put(`/projects/${id}`, data),

  deleteProject: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/projects/${id}`),

  // Experience APIs
  getExperiences: (): Promise<
    AxiosResponse<ApiResponse<{ experiences: Experience[] }>>
  > => api.get("/experience"),

  createExperience: (
    data: Omit<Experience, "_id" | "createdAt" | "updatedAt">
  ): Promise<AxiosResponse<ApiResponse<{ experience: Experience }>>> =>
    api.post("/experience", data),

  updateExperience: (
    id: string,
    data: Partial<Experience>
  ): Promise<AxiosResponse<ApiResponse<{ experience: Experience }>>> =>
    api.put(`/experience/${id}`, data),

  deleteExperience: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/experience/${id}`),

  // Education APIs
  getEducation: (): Promise<
    AxiosResponse<ApiResponse<{ education: Education[] }>>
  > => api.get("/education"),

  createEducation: (
    data: Omit<Education, "_id" | "createdAt" | "updatedAt">
  ): Promise<AxiosResponse<ApiResponse<{ education: Education }>>> =>
    api.post("/education", data),

  updateEducation: (
    id: string,
    data: Partial<Education>
  ): Promise<AxiosResponse<ApiResponse<{ education: Education }>>> =>
    api.put(`/education/${id}`, data),

  deleteEducation: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/education/${id}`),

  // Contact APIs
  getContact: (): Promise<AxiosResponse<ApiResponse<{ contact: Contact }>>> =>
    api.get("/contact"),

  updateContact: (
    data: Partial<Contact>
  ): Promise<AxiosResponse<ApiResponse<{ contact: Contact }>>> =>
    api.put("/contact", data),

  // Contact Forms APIs
  getContactForms: (): Promise<
    AxiosResponse<ApiResponse<{ forms: ContactForm[]; unreadCount: number }>>
  > => api.get("/contact/forms"),

  getContactForm: (
    id: string
  ): Promise<AxiosResponse<ApiResponse<{ form: ContactForm }>>> =>
    api.get(`/contact/forms/${id}`),

  toggleContactFormRead: (
    id: string,
    isRead: boolean
  ): Promise<AxiosResponse<ApiResponse<{ form: ContactForm }>>> =>
    api.put(`/contact/forms/${id}/read`, { isRead }),

  toggleContactFormArchive: (
    id: string,
    isArchived: boolean
  ): Promise<AxiosResponse<ApiResponse<{ form: ContactForm }>>> =>
    api.put(`/contact/forms/${id}/archive`, { isArchived }),

  deleteContactForm: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/contact/forms/${id}`),

  // File Upload APIs
  uploadFile: (
    formData: FormData
  ): Promise<AxiosResponse<ApiResponse<FileUploadResponse>>> =>
    api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteFile: (fileName: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/upload/${fileName}`),

  // Hero specific uploads
  uploadHeroImage: (
    formData: FormData
  ): Promise<AxiosResponse<ApiResponse<{ profileImage: string }>>> =>
    api.post("/hero/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  uploadHeroCV: (
    formData: FormData
  ): Promise<AxiosResponse<ApiResponse<{ cvUrl: string }>>> =>
    api.post("/hero/upload-cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Project specific uploads
  uploadProjectImage: (
    id: string,
    formData: FormData
  ): Promise<AxiosResponse<ApiResponse<{ imageUrl: string }>>> =>
    api.post(`/projects/${id}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default api;

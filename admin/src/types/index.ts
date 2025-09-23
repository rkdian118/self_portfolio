// src/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Hero {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  cvUrl: string;
  yearsExperience: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Technology {
  _id?: string;
  name: string;
  category: "frontend" | "backend" | "database" | "tools" | "cloud" | "mobile";
  icon: string;
  color: string;
  proficiency: number; // 1-100
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  duration: string;
  skills: string[] | string;
  website?: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
  website: string;
  duration: string;
  location: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  _id: string;
  degree: string;
  institution: string;
  duration: string;
  location: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  _id?: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactForm {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  company: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

// Auth types
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface HeroForm {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  cvUrl: string;
  yearsExperience: number;
}

export interface TechnologyForm {
  name: string;
  category: string;
  icon: string;
  color: string;
  proficiency: number;
}

export interface ProjectForm {
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  features: string[];
  challenges: string;
  solutions: string;
  category: string;
  status: string;
  isFeatured: boolean;
}

// Dashboard stats
export interface DashboardStats {
  totalProjects: number;
  totalTechnologies: number;
  totalExperiences: number;
  totalEducation: number;
  totalContactForms: number;
  unreadContactForms: number;
  activeProjects: number;
  featuredProjects: number;
}

// File upload
export interface FileUploadResponse {
  success: boolean;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

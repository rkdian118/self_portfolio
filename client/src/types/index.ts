// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field?: string;
    message: string;
    value?: any;
  }>;
}

export interface PaginationData {
  current: number;
  total: number;
  count: number;
  totalDocuments: number;
}

export interface ApiListResponse<T>
  extends ApiResponse<{
    items: T[];
    pagination: PaginationData;
  }> {}

export interface ProjectsResponse
  extends ApiResponse<{
    projects: Project[];
    pagination: PaginationData;
  }> {}

export interface ExperiencesResponse
  extends ApiResponse<{
    experiences: Experience[];
    pagination: PaginationData;
  }> {}

export interface EducationResponse
  extends ApiResponse<{
    education: Education[];
    pagination: PaginationData;
  }> {}

// Entity Interfaces
export interface Hero {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  yearsExperience: number;
  cvUrl?: string;
  profileImage?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id?: string;
  name: string;
  description: string;
  duration: string;
  skills: string;
  website: string;
  image?: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  website: string;
  duration: string;
  location: string;
  description: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  duration: string;
  location: string;
  description?: string;
  order: number;
  isActive?: boolean;
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
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  role: string;
  company: string;
  message: string;
}

export interface ContactFormResponse {
  id: string;
  submittedAt: string;
}

// Store State Interfaces
export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

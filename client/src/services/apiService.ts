import {
  ApiResponse,
  ApiListResponse,
  Hero,
  Project,
  Experience,
  Education,
  Contact,
  ContactFormData,
  ContactFormResponse,
} from "../types";

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  // Hero API
  async getHero(): Promise<ApiResponse<{ hero: Hero }>> {
    return this.request<ApiResponse<{ hero: Hero }>>("/hero");
  }

  // Projects API
  async getProjects(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiListResponse<Project>> {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    const endpoint = `/projects${query ? `?${query}` : ""}`;

    return this.request<ApiListResponse<Project>>(endpoint);
  }

  async getProject(id: string): Promise<ApiResponse<{ project: Project }>> {
    return this.request<ApiResponse<{ project: Project }>>(`/projects/${id}`);
  }

  // Experience API
  async getExperiences(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiListResponse<Experience>> {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    const endpoint = `/experience${query ? `?${query}` : ""}`;

    return this.request<ApiListResponse<Experience>>(endpoint);
  }

  // Education API
  async getEducation(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiListResponse<Education>> {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    const endpoint = `/education${query ? `?${query}` : ""}`;

    return this.request<ApiListResponse<Education>>(endpoint);
  }

  // Contact API
  async getContact(): Promise<ApiResponse<{ contact: Contact }>> {
    return this.request<ApiResponse<{ contact: Contact }>>("/contact");
  }

  async submitContactForm(
    data: ContactFormData
  ): Promise<ApiResponse<ContactFormResponse>> {
    return this.request<ApiResponse<ContactFormResponse>>("/contact/form", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();

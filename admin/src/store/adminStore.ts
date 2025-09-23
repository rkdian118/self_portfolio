// src/store/adminStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { adminAPI } from "@/services/api";
import {
  User,
  Hero,
  Technology,
  Project,
  Experience,
  Education,
  Contact,
  ContactForm,
  DashboardStats,
  LoadingState,
  ErrorState,
} from "@/types";

interface AdminState {
  // Authentication
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;

  // Data state
  hero: Hero | null;
  technologies: Technology[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  contact: Contact | null;
  contactForms: ContactForm[];
  dashboardStats: DashboardStats | null;

  // UI state
  loading: LoadingState;
  errors: ErrorState;

  // Auth actions
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;

  // Utility actions
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string | null) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;

  // Dashboard actions
  fetchDashboardStats: () => Promise<void>;

  // Hero actions
  fetchHero: () => Promise<void>;
  updateHero: (
    heroData: Partial<Hero>
  ) => Promise<{ success: boolean; message?: string }>;
  uploadHeroImage: (
    file: File
  ) => Promise<{ success: boolean; profileImage?: string; message?: string }>;
  uploadHeroCV: (
    file: File
  ) => Promise<{ success: boolean; cvUrl?: string; message?: string }>;

  // Technology actions
  fetchTechnologies: () => Promise<void>;
  createTechnology: (
    techData: Omit<Technology, "_id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean; message?: string }>;
  updateTechnology: (
    id: string,
    techData: Partial<Technology>
  ) => Promise<{ success: boolean; message?: string }>;
  deleteTechnology: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // Project actions
  fetchProjects: () => Promise<void>;
  createProject: (
    projectData: Omit<Project, "_id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean; message?: string }>;
  updateProject: (
    id: string,
    projectData: Partial<Project>
  ) => Promise<{ success: boolean; message?: string }>;
  deleteProject: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;
  uploadProjectImage: (
    id: string,
    file: File
  ) => Promise<{ success: boolean; imageUrl?: string; message?: string }>;

  // Experience actions
  fetchExperiences: () => Promise<void>;
  createExperience: (
    expData: Omit<Experience, "_id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean; message?: string }>;
  updateExperience: (
    id: string,
    expData: Partial<Experience>
  ) => Promise<{ success: boolean; message?: string }>;
  deleteExperience: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // Education actions
  fetchEducation: () => Promise<void>;
  createEducation: (
    eduData: Omit<Education, "_id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean; message?: string }>;
  updateEducation: (
    id: string,
    eduData: Partial<Education>
  ) => Promise<{ success: boolean; message?: string }>;
  deleteEducation: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // Contact actions
  fetchContact: () => Promise<void>;
  updateContact: (
    contactData: Partial<Contact>
  ) => Promise<{ success: boolean; message?: string }>;

  // Contact form actions
  fetchContactForms: () => Promise<void>;
  getContactForm: (
    id: string
  ) => Promise<{ success: boolean; form?: ContactForm; message?: string }>;
  toggleContactFormRead: (
    id: string,
    isRead: boolean
  ) => Promise<{ success: boolean; message?: string }>;
  toggleContactFormArchive: (
    id: string,
    isArchived: boolean
  ) => Promise<{ success: boolean; message?: string }>;
  deleteContactForm: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // File upload
  uploadFile: (file: File) => Promise<{
    success: boolean;
    fileUrl?: string;
    fileName?: string;
    message?: string;
  }>;

  // Initialize all data
  initializeAdmin: () => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        user: null,
        token: null,
        hero: null,
        technologies: [],
        projects: [],
        experiences: [],
        education: [],
        contact: null,
        contactForms: [],
        dashboardStats: null,
        loading: {},
        errors: {},

        // Utility functions
        setLoading: (key: string, loading: boolean) =>
          set((state) => ({
            loading: { ...state.loading, [key]: loading },
          })),

        setError: (key: string, error: string | null) =>
          set((state) => ({
            errors: { ...state.errors, [key]: error },
          })),

        clearError: (key: string) =>
          set((state) => ({
            errors: { ...state.errors, [key]: null },
          })),

        clearAllErrors: () => set({ errors: {} }),

        // Authentication
        login: async (email: string, password: string) => {
          const { setLoading, setError } = get();
          setLoading("auth", true);
          setError("auth", null);

          try {
            const response = await adminAPI.login(email, password);
            if (response.data.success) {
              console.log(response.data, "response data");

              const { tokens, admin } = response.data.data;
              localStorage.setItem("adminToken", tokens.accessToken);
              set({
                isAuthenticated: true,
                user: {
                  id: admin.id,
                  email: admin.email,
                  name: admin.name,
                  role: admin.role === 'super-admin' ? 'admin' : admin.role,
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: admin.lastLoginAt
                } as User,
                token: tokens.accessToken,
              });
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Login failed";
            setError("auth", message);
            return { success: false, message };
          } finally {
            setLoading("auth", false);
          }
        },

        logout: () => {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin-storage");
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            hero: null,
            technologies: [],
            projects: [],
            experiences: [],
            education: [],
            contact: null,
            contactForms: [],
            dashboardStats: null,
            errors: {},
          });
        },

        verifyToken: async () => {
          const token = localStorage.getItem("adminToken");
          if (!token) {
            set({ isAuthenticated: false, user: null, token: null });
            return false;
          }

          try {
            const response = await adminAPI.verifyToken();
            if (response.data.success) {
              const userData = response.data.data.user;
              set({
                isAuthenticated: true,
                user: {
                  id: userData.id,
                  email: userData.email,
                  name: userData.name,
                  role: userData.role === 'super-admin' ? 'admin' : userData.role,
                  isActive: userData.isActive,
                  createdAt: userData.createdAt,
                  updatedAt: userData.updatedAt
                } as User,
                token,
              });
              return true;
            }
          } catch (error: unknown) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin-storage");
            set({ isAuthenticated: false, user: null, token: null });
          }
          return false;
        },

        // Dashboard
        fetchDashboardStats: async () => {
          const { setLoading, setError } = get();
          setLoading("dashboard", true);
          setError("dashboard", null);

          try {
            const response = await adminAPI.getDashboardStats();
            if (response.data.success) {
              set({ dashboardStats: response.data.data });
            }
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to fetch dashboard stats";
            setError("dashboard", message);
          } finally {
            setLoading("dashboard", false);
          }
        },

        // Hero management
        fetchHero: async () => {
          const { setLoading, setError } = get();
          setLoading("hero", true);
          setError("hero", null);

          try {
            const response = await adminAPI.getHero();
            if (response.data.success) {
              set({ hero: response.data.data.hero });
            }
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Failed to fetch hero";
            setError("hero", message);
          } finally {
            setLoading("hero", false);
          }
        },

        updateHero: async (heroData: Partial<Hero>) => {
          const { setLoading, setError } = get();
          setLoading("hero", true);
          setError("hero", null);

          try {
            const response = await adminAPI.updateHero(heroData);
            if (response.data.success) {
              set({ hero: response.data.data.hero });
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Failed to update hero";
            setError("hero", message);
            return { success: false, message };
          } finally {
            setLoading("hero", false);
          }
        },

        uploadHeroImage: async (file: File) => {
          const { setLoading, setError } = get();
          setLoading("hero", true);
          setError("hero", null);

          try {
            const formData = new FormData();
            formData.append('profileImage', file);
            
            const response = await adminAPI.uploadHeroImage(formData);
            if (response.data.success) {
              return {
                success: true,
                profileImage: response.data.data.profileImage,
              };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Failed to upload image";
            setError("hero", message);
            return { success: false, message };
          } finally {
            setLoading("hero", false);
          }
        },

        uploadHeroCV: async (file: File) => {
          const { setLoading, setError } = get();
          setLoading("hero", true);
          setError("hero", null);

          try {
            const formData = new FormData();
            formData.append('cv', file);
            
            const response = await adminAPI.uploadHeroCV(formData);
            if (response.data.success) {
              return {
                success: true,
                cvUrl: response.data.data.cvUrl,
              };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Failed to upload CV";
            setError("hero", message);
            return { success: false, message };
          } finally {
            setLoading("hero", false);
          }
        },

        // Technology management
        fetchTechnologies: async () => {
          const { setLoading, setError } = get();
          setLoading("technologies", true);
          setError("technologies", null);

          try {
            const response = await adminAPI.getTechnologies();
            if (response.data.success) {
              set({ technologies: response.data.data.technologies });
            }
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to fetch technologies";
            setError("technologies", message);
          } finally {
            setLoading("technologies", false);
          }
        },

        createTechnology: async (techData) => {
          const { setLoading, setError, fetchTechnologies } = get();
          setLoading("technologies", true);
          setError("technologies", null);

          try {
            const response = await adminAPI.createTechnology(techData);
            if (response.data.success) {
              await fetchTechnologies();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to create technology";
            setError("technologies", message);
            return { success: false, message };
          } finally {
            setLoading("technologies", false);
          }
        },

        updateTechnology: async (id: string, techData: Partial<Technology>) => {
          const { setLoading, setError, fetchTechnologies } = get();
          setLoading("technologies", true);
          setError("technologies", null);

          try {
            const response = await adminAPI.updateTechnology(id, techData);
            if (response.data.success) {
              await fetchTechnologies();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to update technology";
            setError("technologies", message);
            return { success: false, message };
          } finally {
            setLoading("technologies", false);
          }
        },

        deleteTechnology: async (id: string) => {
          const { setLoading, setError, fetchTechnologies } = get();
          setLoading("technologies", true);
          setError("technologies", null);

          try {
            const response = await adminAPI.deleteTechnology(id);
            if (response.data.success) {
              await fetchTechnologies();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to delete technology";
            setError("technologies", message);
            return { success: false, message };
          } finally {
            setLoading("technologies", false);
          }
        },

        // Project management
        fetchProjects: async () => {
          const { setLoading, setError } = get();
          setLoading("projects", true);
          setError("projects", null);

          try {
            const response = await adminAPI.getProjects();
            if (response.data.success) {
              set({ projects: response.data.data.projects });
            }
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to fetch projects";
            setError("projects", message);
          } finally {
            setLoading("projects", false);
          }
        },

        createProject: async (projectData) => {
          const { setLoading, setError, fetchProjects } = get();
          setLoading("projects", true);
          setError("projects", null);

          try {
            const response = await adminAPI.createProject(projectData);
            if (response.data.success) {
              await fetchProjects();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to create project";
            setError("projects", message);
            return { success: false, message };
          } finally {
            setLoading("projects", false);
          }
        },

        updateProject: async (id: string, projectData: Partial<Project>) => {
          const { setLoading, setError, fetchProjects } = get();
          setLoading("projects", true);
          setError("projects", null);

          try {
            const response = await adminAPI.updateProject(id, projectData);
            if (response.data.success) {
              await fetchProjects();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to update project";
            setError("projects", message);
            return { success: false, message };
          } finally {
            setLoading("projects", false);
          }
        },

        deleteProject: async (id: string) => {
          const { setLoading, setError, fetchProjects } = get();
          setLoading("projects", true);
          setError("projects", null);

          try {
            const response = await adminAPI.deleteProject(id);
            if (response.data.success) {
              await fetchProjects();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to delete project";
            setError("projects", message);
            return { success: false, message };
          } finally {
            setLoading("projects", false);
          }
        },

        uploadProjectImage: async (id: string, file: File) => {
          const { setLoading, setError } = get();
          setLoading("projects", true);
          setError("projects", null);

          try {
            const formData = new FormData();
            formData.append('projectImage', file);
            
            const response = await adminAPI.uploadProjectImage(id, formData);
            if (response.data.success) {
              return {
                success: true,
                imageUrl: response.data.data.imageUrl,
              };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Failed to upload image";
            setError("projects", message);
            return { success: false, message };
          } finally {
            setLoading("projects", false);
          }
        },

        // Experience management
        fetchExperiences: async () => {
          const { setLoading, setError } = get();
          setLoading("experiences", true);
          setError("experiences", null);

          try {
            const response = await adminAPI.getExperiences();
            if (response.data.success) {
              set({ experiences: response.data.data.experiences });
            }
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to fetch experiences";
            setError("experiences", message);
          } finally {
            setLoading("experiences", false);
          }
        },

        createExperience: async (expData) => {
          const { setLoading, fetchExperiences } = get();
          setLoading("experiences", true);

          try {
            const response = await adminAPI.createExperience(expData);
            if (response.data.success) {
              await fetchExperiences();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to create experience";
            return { success: false, message };
          } finally {
            setLoading("experiences", false);
          }
        },

        updateExperience: async (id: string, expData: Partial<Experience>) => {
          const { setLoading, fetchExperiences } = get();
          setLoading("experiences", true);

          try {
            const response = await adminAPI.updateExperience(id, expData);
            if (response.data.success) {
              await fetchExperiences();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to update experience";
            return { success: false, message };
          } finally {
            setLoading("experiences", false);
          }
        },

        deleteExperience: async (id: string) => {
          const { setLoading, fetchExperiences } = get();
          setLoading("experiences", true);

          try {
            const response = await adminAPI.deleteExperience(id);
            if (response.data.success) {
              await fetchExperiences();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to delete experience";
            return { success: false, message };
          } finally {
            setLoading("experiences", false);
          }
        },

        // Education management
        fetchEducation: async () => {
          const { setLoading, setError } = get();
          setLoading("education", true);
          setError("education", null);

          try {
            const response = await adminAPI.getEducation();
            if (response.data.success) {
              set({ education: response.data.data.education });
            }
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to fetch education";
            setError("education", message);
          } finally {
            setLoading("education", false);
          }
        },

        createEducation: async (eduData) => {
          const { setLoading, fetchEducation } = get();
          setLoading("education", true);

          try {
            const response = await adminAPI.createEducation(eduData);
            if (response.data.success) {
              await fetchEducation();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to create education";
            return { success: false, message };
          } finally {
            setLoading("education", false);
          }
        },

        updateEducation: async (id: string, eduData: Partial<Education>) => {
          const { setLoading, fetchEducation } = get();
          setLoading("education", true);

          try {
            const response = await adminAPI.updateEducation(id, eduData);
            if (response.data.success) {
              await fetchEducation();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to update education";
            return { success: false, message };
          } finally {
            setLoading("education", false);
          }
        },

        deleteEducation: async (id: string) => {
          const { setLoading, fetchEducation } = get();
          setLoading("education", true);

          try {
            const response = await adminAPI.deleteEducation(id);
            if (response.data.success) {
              await fetchEducation();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to delete education";
            return { success: false, message };
          } finally {
            setLoading("education", false);
          }
        },

        // Contact management
        fetchContact: async () => {
          const { setLoading, setError } = get();
          setLoading("contact", true);
          setError("contact", null);

          try {
            const response = await adminAPI.getContact();
            if (response.data.success) {
              set({ contact: response.data.data.contact });
            }
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to fetch contact";
            setError("contact", message);
          } finally {
            setLoading("contact", false);
          }
        },

        updateContact: async (contactData: Partial<Contact>) => {
          const { setLoading, setError } = get();
          setLoading("contact", true);
          setError("contact", null);

          try {
            const response = await adminAPI.updateContact(contactData);
            if (response.data.success) {
              set({ contact: response.data.data.contact });
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to update contact";
            setError("contact", message);
            return { success: false, message };
          } finally {
            setLoading("contact", false);
          }
        },

        // Contact form management
        fetchContactForms: async () => {
          const { setLoading, setError } = get();
          setLoading("contactForms", true);
          setError("contactForms", null);

          try {
            const response = await adminAPI.getContactForms();
            if (response.data.success) {
              set({ contactForms: response.data.data.forms });
            }
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to fetch contact forms";
            setError("contactForms", message);
          } finally {
            setLoading("contactForms", false);
          }
        },

        getContactForm: async (id: string) => {
          const { setLoading } = get();
          setLoading("contactForms", true);

          try {
            const response = await adminAPI.getContactForm(id);
            if (response.data.success) {
              return { success: true, form: response.data.data.form };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Failed to fetch contact form";
            return { success: false, message };
          } finally {
            setLoading("contactForms", false);
          }
        },

        toggleContactFormRead: async (id: string, isRead: boolean) => {
          const { setLoading, fetchContactForms } = get();
          setLoading("contactForms", true);

          try {
            const response = await adminAPI.toggleContactFormRead(id, isRead);
            if (response.data.success) {
              await fetchContactForms();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Failed to update read status";
            return { success: false, message };
          } finally {
            setLoading("contactForms", false);
          }
        },

        toggleContactFormArchive: async (id: string, isArchived: boolean) => {
          const { setLoading, fetchContactForms } = get();
          setLoading("contactForms", true);

          try {
            const response = await adminAPI.toggleContactFormArchive(id, isArchived);
            if (response.data.success) {
              await fetchContactForms();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Failed to update archive status";
            return { success: false, message };
          } finally {
            setLoading("contactForms", false);
          }
        },

        deleteContactForm: async (id: string) => {
          const { setLoading, fetchContactForms } = get();
          setLoading("contactForms", true);

          try {
            const response = await adminAPI.deleteContactForm(id);
            if (response.data.success) {
              await fetchContactForms();
              return { success: true };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error
                ? error.message
                : "Failed to delete contact form";
            return { success: false, message };
          } finally {
            setLoading("contactForms", false);
          }
        },

        // File upload
        uploadFile: async (file: File) => {
          const { setLoading, setError } = get();
          setLoading("upload", true);
          setError("upload", null);

          try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await adminAPI.uploadFile(formData);
            if (response.data.success) {
              return {
                success: true,
                fileUrl: response.data.data.fileUrl,
                fileName: response.data.data.fileName,
              };
            }
            return { success: false, message: response.data.message };
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "File upload failed";
            setError("upload", message);
            return { success: false, message };
          } finally {
            setLoading("upload", false);
          }
        },

        // Initialize all data
        initializeAdmin: async () => {
          const {
            fetchDashboardStats,
            fetchHero,
            fetchTechnologies,
            fetchProjects,
            fetchExperiences,
            fetchEducation,
            fetchContact,
            fetchContactForms,
          } = get();

          await Promise.allSettled([
            fetchDashboardStats(),
            fetchHero(),
            fetchTechnologies(),
            fetchProjects(),
            fetchExperiences(),
            fetchEducation(),
            fetchContact(),
            fetchContactForms(),
          ]);
        },
      }),
      {
        name: "admin-storage",
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          token: state.token,
        }),
      }
    ),
    {
      name: "admin-store",
    }
  )
);

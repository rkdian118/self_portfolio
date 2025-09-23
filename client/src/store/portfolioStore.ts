import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Hero,
  Project,
  Experience,
  Education,
  Contact,
  ContactFormData,
  LoadingState,
  ErrorState,
} from "../types";
import { apiService } from "../services/apiService";

interface PortfolioStore {
  // Data
  hero: Hero | null;
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  contact: Contact | null;

  // Loading states
  loading: LoadingState;

  // Error states
  errors: ErrorState;

  // Actions
  setLoading: (key: string, value: boolean) => void;
  setError: (key: string, error: string | null) => void;

  // Hero actions
  fetchHero: () => Promise<void>;

  // Projects actions
  fetchProjects: (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;

  // Experience actions
  fetchExperiences: (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;

  // Education actions
  fetchEducation: (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;

  // Contact actions
  fetchContact: () => Promise<void>;
  submitContactForm: (
    data: ContactFormData
  ) => Promise<{ success: boolean; message: string }>;

  // Utility actions
  fetchAllData: () => Promise<void>;
  clearErrors: () => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      hero: null,
      projects: [],
      experiences: [],
      education: [],
      contact: null,
      loading: {},
      errors: {},

      // Utility functions
      setLoading: (key: string, value: boolean) =>
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        })),

      setError: (key: string, error: string | null) =>
        set((state) => ({
          errors: { ...state.errors, [key]: error },
        })),

      // Hero actions
      fetchHero: async () => {
        const { setLoading, setError } = get();
        setLoading("hero", true);
        setError("hero", null);

        try {
          const response = await apiService.getHero();
          if (response.success && response.data) {
            set({ hero: response.data.hero });
          } else {
            throw new Error(response.error || "Failed to fetch hero data");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          setError("hero", errorMessage);
          console.error("Error fetching hero:", error);
        } finally {
          setLoading("hero", false);
        }
      },

      // Projects actions
      fetchProjects: async (params) => {
        const { setLoading, setError } = get();
        setLoading("projects", true);
        setError("projects", null);

        try {
          const response = await apiService.getProjects(params);
          console.log('Projects API Response:', response);
          if (response.success && response.data) {
            console.log('Setting projects:', response.data.projects);
            set({ projects: response.data.projects });
          } else {
            throw new Error(response.error || "Failed to fetch projects");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          setError("projects", errorMessage);
          console.error("Error fetching projects:", error);
        } finally {
          setLoading("projects", false);
        }
      },

      // Experience actions
      fetchExperiences: async (params) => {
        const { setLoading, setError } = get();
        setLoading("experiences", true);
        setError("experiences", null);

        try {
          const response = await apiService.getExperiences(params);
          console.log('Experiences API Response:', response);
          if (response.success && response.data) {
            console.log('Setting experiences:', response.data.experiences);
            set({ experiences: response.data.experiences });
          } else {
            throw new Error(response.error || "Failed to fetch experiences");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          setError("experiences", errorMessage);
          console.error("Error fetching experiences:", error);
        } finally {
          setLoading("experiences", false);
        }
      },

      // Education actions
      fetchEducation: async (params) => {
        const { setLoading, setError } = get();
        setLoading("education", true);
        setError("education", null);

        try {
          const response = await apiService.getEducation(params);
          console.log('Education API Response:', response);
          if (response.success && response.data) {
            console.log('Setting education:', response.data?.education || []);
            set({ education: response.data?.education || [] });
          } else {
            throw new Error(response.error || "Failed to fetch education");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          setError("education", errorMessage);
          console.error("Error fetching education:", error);
        } finally {
          setLoading("education", false);
        }
      },

      // Contact actions
      fetchContact: async () => {
        const { setLoading, setError } = get();
        setLoading("contact", true);
        setError("contact", null);

        try {
          const response = await apiService.getContact();
          if (response.success && response.data) {
            console.log(response.data, "<<< Education Data");
            set({ contact: response.data.contact });
          } else {
            throw new Error(response.error || "Failed to fetch contact data");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          setError("contact", errorMessage);
          console.error("Error fetching contact:", error);
        } finally {
          setLoading("contact", false);
        }
      },

      submitContactForm: async (data: ContactFormData) => {
        const { setLoading, setError } = get();
        setLoading("contactForm", true);
        setError("contactForm", null);

        try {
          const response = await apiService.submitContactForm(data);

          if (response.success) {
            return {
              success: true,
              message:
                response.message ||
                "Thank you for your message! I will get back to you soon.",
            };
          } else {
            throw new Error(response.error || "Failed to submit contact form");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

          setError("contactForm", errorMessage);
          return {
            success: false,
            message: errorMessage,
          };
        } finally {
          setLoading("contactForm", false);
        }
      },

      // Utility actions
      fetchAllData: async () => {
        const {
          fetchHero,
          fetchProjects,
          fetchExperiences,
          fetchEducation,
          fetchContact,
        } = get();

        try {
          await Promise.all([
            fetchHero(),
            fetchProjects({ limit: 20 }),
            fetchExperiences({ limit: 20 }),
            fetchEducation({ limit: 20 }),
            fetchContact(),
          ]);
        } catch (error) {
          console.error("Error fetching all data:", error);
        }
      },

      clearErrors: () => set({ errors: {} }),
    }),
    {
      name: "portfolio-store",
    }
  )
);

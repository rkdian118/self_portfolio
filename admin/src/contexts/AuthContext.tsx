// src/contexts/AuthContext.tsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, ReactNode } from "react";
import { useAdminStore } from "@/store/adminStore";
import { AuthContextType, User } from "@/types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, user, login, logout, verifyToken, loading } =
    useAdminStore();

  useEffect(() => {
    // Verify token on app load
    const initAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        await verifyToken();
      }
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user: user as User | null, // Type assertion for proper typing
    login,
    logout,
    loading: loading.auth || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

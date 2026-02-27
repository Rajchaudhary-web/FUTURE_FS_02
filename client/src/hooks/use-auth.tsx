import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useLocation } from "wouter";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwt_token"));
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const login = (newToken: string) => {
    localStorage.setItem("jwt_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    queryClient.clear();
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

type AuthInput = z.infer<typeof api.auth.login.input>;

export function useLogin() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: async (data: AuthInput) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to login");
      }
      
      const parsed = api.auth.login.responses[200].parse(await res.json());
      return parsed.token;
    },
    onSuccess: (token) => login(token),
  });
}

export function useRegister() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: async (data: AuthInput) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to register");
      }
      
      const parsed = api.auth.register.responses[201].parse(await res.json());
      return parsed.token;
    },
    onSuccess: (token) => login(token),
  });
}

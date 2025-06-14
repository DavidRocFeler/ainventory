// src/server/auth.api.ts
import { LoginCredentials, AuthResponse } from "../types/auth";
import { useAuthStore } from "@/stores/auth.store";

const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al iniciar sesión");
    }

    return response.json();
  },

  getProtectedData: async (): Promise<any> => {
    const token = useAuthStore.getState().token;
    
    const response = await fetch(`${API_URL}/protected-route`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener datos protegidos");
    }

    return response.json();
  },
};
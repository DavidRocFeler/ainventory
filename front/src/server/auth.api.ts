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
      throw new Error(error.message || "Error to login");
    }

    return response.json();
  },

};
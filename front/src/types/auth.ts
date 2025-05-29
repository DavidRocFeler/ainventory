// src/types/auth/auth.ts
export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: string;
      email: string;
      // otros campos que devuelva tu backend
    };
  }
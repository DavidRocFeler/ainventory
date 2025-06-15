// src/features/auth/auth.hooks.ts
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../server/auth.api";
import { LoginCredentials } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/auth.store";

export const useLogin = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Guardar token y usuario en el store
      loginStore(data.token, data.user);
      
      // Redirigir al dashboard
      navigate("/dashboard");
      
      // Mostrar notificación de éxito
      toast({
        title: "Successful login",
        description: `Welcome ${data.user.email}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return () => {
    logoutStore();
    navigate("/");
    toast({
      title: "Closed session",
      description: "You have successfully logged out",
    });
  };
};
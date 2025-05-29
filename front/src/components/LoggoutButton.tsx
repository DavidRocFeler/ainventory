// src/components/LogoutButton.tsx
import { Button } from "@/components/ui/button";
import { useLogout } from "../hooks/auth.hook";

export const LogoutButton = () => {
  const logout = useLogout();

  return (
    <Button variant="outline" onClick={logout}>
      Log out
    </Button>
  );
};
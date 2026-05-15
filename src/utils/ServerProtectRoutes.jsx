import { Navigate } from "react-router-dom";
import { useServerAuthContext } from "@/hooks/servers/useServerAuthContext.js";
import { LoaderCircle } from "lucide-react";

// Bảo vệ route theo login + role
export const ServerProtectRoutes = ({ children, rolesAllowed }) => {
  const { authUser, isLoggedIn, isLoading } = useServerAuthContext();

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn || !authUser) {
    return <Navigate to="/server/login" replace />;
  }

  if (
    rolesAllowed &&
    !rolesAllowed.some((role) => authUser?.roles?.some((r) => r.code === role))
  ) {
    return <Navigate to="/server" replace />;
  }

  return children;
};

export const RedirectAuthenticatedUser = ({ children }) => {
  const { authUser, isLoggedIn } = useServerAuthContext();

  if (isLoggedIn && authUser) {
    return <Navigate to="/server" replace />;
  }

  return children;
};

import { Navigate } from "react-router-dom";
import { useClientAuthContext } from "../hooks/clients/useClientAuthContext";

export const ClientProtectRoutes = ({ children }) => {
  const { authUser, isLoggedIn, loading } = useClientAuthContext();

  if (loading) return

  if (!isLoggedIn || !authUser) {
    return <Navigate to="/client/login" replace />;
  }

  return children;
};

export const RedirectAuthenticatedUser = ({ children }) => {
  const { authUser, isLoggedIn, loading } = useClientAuthContext();

  if (loading) return 

  if (isLoggedIn && authUser) {
    return <Navigate to="/client/home" replace />;
  }

  return children;
};

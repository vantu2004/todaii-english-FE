import { Navigate } from "react-router-dom";
import { useServerAuthContext } from "../hooks/servers/useServerAuthContext.js";

export const ServerProtectRoutes = ({ children }) => {
  const { authUser, isLoggedIn } = useServerAuthContext();

  if (!isLoggedIn || !authUser) {
    return <Navigate to="/server/login" replace />;
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

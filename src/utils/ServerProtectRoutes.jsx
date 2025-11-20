import { Navigate } from "react-router-dom";
import { useServerAuthContext } from "../hooks/servers/useServerAuthContext.js";

// Bảo vệ route theo login + role
export const ServerProtectRoutes = ({ children, rolesAllowed }) => {
  const { authUser, isLoggedIn } = useServerAuthContext();

  // Chưa login => redirect login
  if (!isLoggedIn || !authUser) {
    return <Navigate to="/server/login" replace />;
  }

  // Nếu rolesAllowed được cung cấp và user không có quyền => redirect dashboard
  if (
    rolesAllowed &&
    !rolesAllowed.some((role) =>
      authUser.roles.map((r) => r.code).includes(role)
    )
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

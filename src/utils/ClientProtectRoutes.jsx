import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import ClientAuthContext from "../context/clients/ClientAuthContext";

const ClientProtectRoutes = () => {
  const { authUser, isLoggedIn } = useContext(ClientAuthContext);

  // If not logged in, redirect to login
  if (!isLoggedIn || !authUser) {
    return <Navigate to="/client/login" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
};

export default ClientProtectRoutes;

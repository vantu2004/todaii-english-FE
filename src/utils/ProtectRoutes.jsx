import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; 

const ProtectRoutes = () => {
  const {
    authUser,
    isLoggedIn,
    appLoading,
  } = useContext(AuthContext);

  if (appLoading) {

    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!isLoggedIn || !authUser) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
};

export default ProtectRoutes;

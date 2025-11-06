import { ClientAuthProvider } from "../../context/clients/ClientAuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "../../modules/clients/pages/auth/Login";
import Register from "../../modules/clients/pages/auth/Register";
import Verify from "../../modules/clients/pages/auth/VerifyOtp";
import ForgotPassword from "../../modules/clients/pages/auth/ForgotPassword";
import ResetPassword from "../../modules/clients/pages/auth/ResetPassword";
import {
  ClientProtectRoutes,
  RedirectAuthenticatedUser,
} from "../../utils/ClientProtectRoutes";

export default function ClientRoutes() {
  return (
    <ClientAuthProvider>
      <Routes>
        {/* PUBLIC routes (chưa login mới vào được) */}
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectAuthenticatedUser>
              <Register />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <RedirectAuthenticatedUser>
              <Verify />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          }
        />

        {/* PROTECTED routes (phải login mới vào được) */}
        {/* <Route
          path="/home"
          element={
            <ClientProtectRoutes>
              <Home />
            </ClientProtectRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ClientProtectRoutes>
              <Profile />
            </ClientProtectRoutes>
          }
        /> */}
      </Routes>
    </ClientAuthProvider>
  );
}

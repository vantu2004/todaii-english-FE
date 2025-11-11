import { ClientAuthProvider } from "../../context/clients/ClientAuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "../../modules/clients/pages/auth/Login";
import Register from "../../modules/clients/pages/auth/Register";
import VerifyOtp from "../../modules/clients/pages/auth/VerifyOtp";
import VerifyEmail from "../../modules/clients/pages/auth/VerifyEmail";
import ForgotPassword from "../../modules/clients/pages/auth/ForgotPassword";
import ResetPassword from "../../modules/clients/pages/auth/ResetPassword";
import ClientLayout from "../../modules/clients/layouts/ClientLayout";
import Home from "../../modules/clients/pages/home/Home"
import Home1 from "../../modules/clients/pages/home/Home1"

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
              <VerifyOtp />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <VerifyEmail />
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

        <Route
          path="/home"
          element={
              <ClientLayout/>
          }
        >
          <Route index element={<Home/>}></Route>
          <Route path="test" element={<Home1/>}></Route>

        </Route>

        {/* PROTECTED routes (phải login mới vào được) */}
        {/* <Route
          path="/home"
          element={
            <ClientProtectRoutes>
              <ClientLayout/>
            </ClientProtectRoutes>
          }
        /> */}
      </Routes>
    </ClientAuthProvider>
  );
}

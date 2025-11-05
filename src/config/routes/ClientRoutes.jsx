import { ClientAuthProvider } from "../../context/clients/ClientAuthContext";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../../modules/clients/pages/LandingPage";
import Login from "../../modules/clients/pages/auth/Login";
import Register from "../../modules/clients/pages/auth/Register";
import Verify from "../../modules/clients/pages/auth/VerifyOtp";
import ForgotPassword from "../../modules/clients/pages/auth/ForgotPassword";
import ResetPassword from "../../modules/clients/pages/auth/ResetPassword";

export default function ClientRoutes() {
  return (
    <ClientAuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </ClientAuthProvider>
  );
}

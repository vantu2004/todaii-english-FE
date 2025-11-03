import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Login2 from "./pages/auth/Login2";
import Register from "./pages/auth/Register";
import Register2 from "./pages/auth/Register2";
import Verify from "./pages/auth/VerifyOtp";
import Verify2 from "./pages/auth/VerifyOtp2";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPassword2 from "./pages/auth/ForgotPassword2";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetPassword2 from "./pages/auth/ResetPassword2";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (

    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      
      <Router>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login2 />} />
          <Route path="/register" element={<Register2 />} />
          <Route path="/verify-otp" element={<Verify2 />} />
          <Route path="/forgot-password" element={<ForgotPassword2 />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword2 />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

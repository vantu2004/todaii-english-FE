import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ClientLandingPage from "./pages/clients/LandingPage";
import ClientLogin from "./pages/clients/auth/Login";
import ClientRegister from "./pages/clients/auth/Register";
import ClientVerify from "./pages/clients/auth/VerifyOtp";
import ClientForgotPassword from "./pages/clients/auth/ForgotPassword";
import ClientResetPassword from "./pages/clients/auth/ResetPassword";

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />

      <Router>
        {/* Client Routes */}
        <Routes>
          <Route path="/client" element={<ClientLandingPage />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/verify-otp" element={<ClientVerify />} />
          <Route
            path="/client/forgot-password"
            element={<ClientForgotPassword />}
          />
          <Route
            path="/client/reset-password/:token"
            element={<ClientResetPassword />}
          />
        </Routes>

        {/* Server Routes */}
        <Routes></Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

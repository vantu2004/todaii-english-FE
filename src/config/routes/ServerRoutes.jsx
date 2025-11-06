import { Routes, Route } from "react-router-dom";
import { ServerAuthProvider } from "../../context/servers/ServerAuthContext";
import { RedirectAuthenticatedUser } from "../../utils/ServerProtectRoutes";
import Login from "../../modules/servers/pages/auth/Login";
import VerifyOtp from "../../modules/servers/pages/auth/VerifyOtp";
import ResendOtp from "../../modules/servers/pages/auth/ResendOtp";

export default function ServerRoutes() {
  return (
    <ServerAuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
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
          path="/resend-otp"
          element={
            <RedirectAuthenticatedUser>
              <ResendOtp />
            </RedirectAuthenticatedUser>
          }
        />
      </Routes>
    </ServerAuthProvider>
  );
}

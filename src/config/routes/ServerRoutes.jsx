import { Routes, Route } from "react-router-dom";
import { ServerAuthProvider } from "../../context/servers/ServerAuthContext";
import { RedirectAuthenticatedUser } from "../../utils/ServerProtectRoutes";
import Login from "../../modules/servers/pages/auth/Login";

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
      </Routes>
    </ServerAuthProvider>
  );
}

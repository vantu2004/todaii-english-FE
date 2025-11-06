import { Routes, Route } from "react-router-dom";
import { ServerAuthProvider } from "../../context/servers/ServerAuthContext";
import { RedirectAuthenticatedUser } from "../../utils/ServerProtectRoutes";

export default function ServerRoutes() {
  return (
    <ServerAuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <h1>Server Login</h1>
            </RedirectAuthenticatedUser>
          }
        />
      </Routes>
    </ServerAuthProvider>
  );
}

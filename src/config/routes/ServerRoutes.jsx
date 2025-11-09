import { Routes, Route } from "react-router-dom";
import { ServerAuthProvider } from "../../context/servers/ServerAuthContext";
import {
  RedirectAuthenticatedUser,
  ServerProtectRoutes,
} from "../../utils/ServerProtectRoutes";
import Login from "../../modules/servers/pages/auth/Login";
import ServerLayout from "../../modules/servers/layouts/ServerLayout";
import Dashboard from "../../modules/servers/pages/Dashboard";
import ManageAdmins from "../../modules/servers/pages/ManageAdmins";
import ManageAdmins2 from "../../modules/servers/pages/ManageAdmins";

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

        <Route element={<ServerLayout />}>
          <Route
            path="/"
            element={
              <ServerProtectRoutes>
                <Dashboard />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/admin"
            element={
              <ServerProtectRoutes>
                <ManageAdmins />
              </ServerProtectRoutes>
            }
          />
        </Route>
      </Routes>
    </ServerAuthProvider>
  );
}

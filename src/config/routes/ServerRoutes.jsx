import { Routes, Route } from "react-router-dom";
import { ServerAuthProvider } from "../../context/servers/ServerAuthContext";
import {
  RedirectAuthenticatedUser,
  ServerProtectRoutes,
} from "../../utils/ServerProtectRoutes";
import Login from "../../modules/servers/pages/Login";
import ServerLayout from "../../modules/servers/layouts/ServerLayout";
import Dashboard from "../../modules/servers/pages/Dashboard";
import ManageAdmins from "../../modules/servers/pages/ManageAdmins";
import ManageUsers from "../../modules/servers/pages/ManageUsers";

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

          <Route
            path="/user"
            element={
              <ServerProtectRoutes>
                <ManageUsers />
              </ServerProtectRoutes>
            }
          />
        </Route>
      </Routes>
    </ServerAuthProvider>
  );
}

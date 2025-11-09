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
import ManageAdmins2 from "../../modules/servers/pages/ManageAdmins2";

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
          path="/"
          element={
            //<ServerProtectRoutes>
            <ServerLayout />

            //</ServerProtectRoutes>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/admins" element={<ManageAdmins />} />
          <Route path="/admins2" element={<ManageAdmins2 />} />
        </Route>
      </Routes>
    </ServerAuthProvider>
  );
}

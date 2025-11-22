import { ClientAuthProvider } from "../../context/clients/ClientAuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "../../modules/clients/pages/auth/Login";
import Register from "../../modules/clients/pages/auth/Register";
import VerifyOtp from "../../modules/clients/pages/auth/VerifyOtp";
import VerifyEmail from "../../modules/clients/pages/auth/VerifyEmail";
import ForgotPassword from "../../modules/clients/pages/auth/ForgotPassword";
import ResetPassword from "../../modules/clients/pages/auth/ResetPassword";
import ClientLayout from "../../modules/clients/layouts/ClientLayout";
import Home from "../../modules/clients/pages/Home";
import Filter from "../../modules/clients/pages/Filter";
import {
  ClientProtectRoutes,
  RedirectAuthenticatedUser,
} from "../../utils/ClientProtectRoutes";
import ArticleDetails from "../../modules/clients/pages/ArticleDetails";
import SavedArticles from "../../modules/clients/pages/userData/SavedArticles";
import Dictionary from "../../modules/clients/pages/dictionary/Dictionary";
import PageNotFound from "../../pages/PageNotFound";
import Profile from "../../modules/clients/pages/userData/Profile";
import VideoDetails from "./../../modules/clients/pages/video/VideoDetails";

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

        <Route path="" element={<ClientLayout />}>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/article/filter" element={<Filter />}></Route>
          <Route path="/article/:id" element={<ArticleDetails />} />
          <Route path="/video" element={<VideoDetails />}></Route>
          <Route path="/dictionary" element={<Dictionary />}></Route>

          <Route
            path="/saved-articles"
            element={
              <ClientProtectRoutes>
                <SavedArticles />
              </ClientProtectRoutes>
            }
          />

          <Route
            path="/profile"
            element={
              <ClientProtectRoutes>
                <Profile />
              </ClientProtectRoutes>
            }
          />
        </Route>

        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </ClientAuthProvider>
  );
}

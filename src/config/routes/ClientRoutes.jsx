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
import ArticleFilter from "../../modules/clients/pages/ArticleFilter";
import {
  ClientProtectRoutes,
  RedirectAuthenticatedUser,
} from "../../utils/ClientProtectRoutes";
import ArticleDetails from "../../modules/clients/pages/ArticleDetails";
import Dictionary from "../../modules/clients/pages/dictionary/Dictionary";
import PageNotFound from "../../pages/PageNotFound";
import Profile from "../../modules/clients/pages/Profile";
import Video from "./../../modules/clients/pages/Video";
import VideoFilter from "../../modules/clients/pages/VideoFilter";

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
          <Route path="/article/filter" element={<ArticleFilter />}></Route>
          <Route path="/article/:id" element={<ArticleDetails />} />
          <Route path="/video" element={<Video />}></Route>
          <Route path="/video/filter" element={<VideoFilter />}></Route>
          <Route path="/video/:id" element={<VideoFilter />}></Route>
          <Route path="/dictionary" element={<Dictionary />}></Route>

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

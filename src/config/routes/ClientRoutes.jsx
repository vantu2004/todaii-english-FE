import { ClientAuthProvider } from "../../context/clients/ClientAuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "../../modules/clients/pages/auth/Login";
import Register from "../../modules/clients/pages/auth/Register";
import VerifyOtp from "../../modules/clients/pages/auth/VerifyOtp";
import VerifyEmail from "../../modules/clients/pages/auth/VerifyEmail";
import ForgotPassword from "../../modules/clients/pages/auth/ForgotPassword";
import ResetPassword from "../../modules/clients/pages/auth/ResetPassword";
import ClientLayout from "../../modules/clients/layouts/ClientLayout";
import Home from "../../modules/clients/pages/home/Home";
import {
  ClientProtectRoutes,
  RedirectAuthenticatedUser,
} from "../../utils/ClientProtectRoutes";
import SearchResults from "../../modules/clients/pages/results/SearchResults";
import ArticleDetails from "../../modules/clients/pages/ArticleDetails";
import SavedArticles from "../../modules/clients/pages/userData/SavedArticles";
import Dictionary from "../../modules/clients/pages/dictionary/Dictionary";
import PageNotFound from "../../pages/PageNotFound";
import Profile from "../../modules/clients/pages/userData/Profile";
import TopicResults from "../../modules/clients/pages/results/TopicResults";
import VideoDetails from './../../modules/clients/pages/video/VideoDetails';

import TestUI from "../../components/clients/TestUI";

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

        <Route path="/" element={<ClientLayout />}>
          <Route path="home" element={<Home />}></Route>
          <Route path="search" element={<SearchResults />}></Route>
          <Route path="article/:id" element={<ArticleDetails />} />
          <Route path="video" element={<VideoDetails />}></Route>
          <Route path="dictionary" element={<Dictionary />}></Route>
          <Route path="/client/topics/:topicId" element={<TopicResults />} />

          <Route
            path="saved-articles"
            element={
              <ClientProtectRoutes>
                <SavedArticles />
              </ClientProtectRoutes>
            }
          />

          <Route
            path="profile"
            element={
              <ClientProtectRoutes>
                <Profile />
              </ClientProtectRoutes>
            }
          />
        </Route>

        <Route path="*" element={<PageNotFound />} />

        {/* PROTECTED routes (phải login mới vào được) */}
        {/* <Route
          path="/test"
          element={
            <ClientProtectRoutes>
              <SavedArticles />
            </ClientProtectRoutes>
          }
        /> */}

        <Route path="/test-ui" element={<TestUI />} />
      </Routes>
    </ClientAuthProvider>
  );
}

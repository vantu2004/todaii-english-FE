import { Routes, Route } from "react-router-dom";
import { ServerAuthProvider } from "../../context/servers/ServerAuthContext";
import {
  RedirectAuthenticatedUser,
  ServerProtectRoutes,
} from "../../utils/ServerProtectRoutes";
import Login from "../../modules/servers/pages/Login";
import ServerLayout from "../../modules/servers/layouts/ServerLayout";
import Dashboard from "../../modules/servers/pages/Dashboard";
import ManageAdmins from "../../modules/servers/pages/manage_admins_page/ManageAdmins";
import ManageUsers from "../../modules/servers/pages/manage_users_page/ManageUsers";
import ManageTopics from "../../modules/servers/pages/manage_topics_page/ManageTopics";
import ManageDictionary from "../../modules/servers/pages/manage_dictionary_page/ManageDictionary";
import DictionaryApi from "../../modules/servers/pages/manage_dictionary_page/DictionaryApi";
import NewsApi from "../../modules/servers/pages/manage_articles_page/NewsApi";
import ManageArticles from "../../modules/servers/pages/manage_articles_page/ManageArticles";
import CreateArticle from "../../modules/servers/pages/manage_articles_page/CreateArticle";
import UpdateArticle from "../../modules/servers/pages/manage_articles_page/UpdateArticle";
import ManageParagraphs from "../../modules/servers/pages/manage_articles_page/ManageParagraphs";
import Youtube from "../../modules/servers/pages/manage_videos_page/Youtube";
import ManageVideos from "../../modules/servers/pages/manage_videos_page/ManageVideos";
import CreateVideo from "../../modules/servers/pages/manage_videos_page/CreateVideo";
import UpdateVideo from "../../modules/servers/pages/manage_videos_page/UpdateVideo";
import ManageLyrics from "../../modules/servers/pages/ManageLyrics";
import ManageVocabGroups from "../../modules/servers/pages/manage_vocab_groups_page/ManageVocabGroups";
import ManageVocabDecks from "../../modules/servers/pages/manage_vocab_decks_page/ManageVocabDecks";
import CreateVocabDeck from "../../modules/servers/pages/manage_vocab_decks_page/CreateVocabDeck";
import UpdateVocabDeck from "../../modules/servers/pages/manage_vocab_decks_page/UpdateVocabDeck";
import ArticlesInTopic from "../../modules/servers/pages/manage_topics_page/ArticlesInTopic";
import VideosInTopic from "../../modules/servers/pages/manage_topics_page/VideosInTopic";
import VocabDecksInGroup from "../../modules/servers/pages/manage_vocab_groups_page/VocabDecksInGroup";
import ManageVocabsInArticle from "../../modules/servers/pages/manage_articles_page/ManageVocabsInArticle";
import ManageVocabsInVideo from "../../modules/servers/pages/manage_videos_page/ManageVocabsInVideo";
import ManageVocabsInVocabDeck from "../../modules/servers/pages/manage_vocab_decks_page/ManageVocabsInVocabDeck";
import { HeaderProvider } from "../../context/servers/HeaderContext";
import Profile from "../../modules/servers/pages/manage_profile_page/Profile";
import GeminiSetting from "../../modules/servers/pages/manage_setting_page/GeminiSetting";
import SmtpSetting from "../../modules/servers/pages/manage_setting_page/SmtpSetting";
import YoutubeSetting from "../../modules/servers/pages/manage_setting_page/YoutubeSetting";
import NewsApiSetting from "../../modules/servers/pages/manage_setting_page/NewsApiSetting";
import CloudinarySetting from "../../modules/servers/pages/manage_setting_page/CloudinarySetting";
import PageNotFound from "../../pages/PageNotFound";
import MyDashboard from "../../modules/servers/pages/manage_profile_page/MyDashboard";
import AdminDashboard from "../../modules/servers/pages/manage_admins_page/AdminDashboard";
import UserDashboard from "../../modules/servers/pages/manage_users_page/UserDashboard";

export default function ServerRoutes() {
  return (
    <ServerAuthProvider>
      <HeaderProvider>
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
            {/* Dashboard: SUPER_ADMIN, USER_MANAGER, CONTENT_MANAGER */}
            <Route
              path="/"
              element={
                <ServerProtectRoutes
                  rolesAllowed={[
                    "SUPER_ADMIN",
                    "USER_MANAGER",
                    "CONTENT_MANAGER",
                  ]}
                >
                  <Dashboard />
                </ServerProtectRoutes>
              }
            />

            {/* Admins: chỉ SUPER_ADMIN */}
            <Route
              path="/admin"
              element={
                <ServerProtectRoutes rolesAllowed={["SUPER_ADMIN"]}>
                  <ManageAdmins />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/admin/:id/dashboard"
              element={
                <ServerProtectRoutes rolesAllowed={["SUPER_ADMIN"]}>
                  <AdminDashboard />
                </ServerProtectRoutes>
              }
            />

            {/* Users: SUPER_ADMIN + USER_MANAGER */}
            <Route
              path="/user"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "USER_MANAGER"]}
                >
                  <ManageUsers />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/user/:id/dashboard"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "USER_MANAGER"]}
                >
                  <UserDashboard />
                </ServerProtectRoutes>
              }
            />

            {/* Dictionaries: SUPER_ADMIN + CONTENT_MANAGER */}
            <Route
              path="/dictionary"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageDictionary />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/dictionary-api"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <DictionaryApi />
                </ServerProtectRoutes>
              }
            />

            {/* News API */}
            <Route
              path="/news-api"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <NewsApi />
                </ServerProtectRoutes>
              }
            />

            {/* Articles */}
            <Route
              path="/article-topic"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageTopics topicType="article" />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/topic/:id/article"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ArticlesInTopic />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/article"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageArticles />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/article/create"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <CreateArticle />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/article/:id/update"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <UpdateArticle />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/article/:id/paragraph"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageParagraphs />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/article/:id/vocab"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageVocabsInArticle />
                </ServerProtectRoutes>
              }
            />

            {/* Videos */}
            <Route
              path="/video-topic"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageTopics topicType="video" />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/topic/:id/video"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <VideosInTopic />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/youtube"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <Youtube />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/video"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageVideos />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/video/create"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <CreateVideo />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/video/:id/update"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <UpdateVideo />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/video/:id/lyric"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageLyrics />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/video/:id/vocab"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageVocabsInVideo />
                </ServerProtectRoutes>
              }
            />

            {/* Learning Tools (Vocab) */}
            <Route
              path="/vocab-group"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageVocabGroups />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/vocab-group/:id/vocab-deck"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <VocabDecksInGroup />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/vocab-deck"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageVocabDecks />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/vocab-deck/create"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <CreateVocabDeck />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/vocab-deck/:id/update"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <UpdateVocabDeck />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/vocab-deck/:id/vocab"
              element={
                <ServerProtectRoutes
                  rolesAllowed={["SUPER_ADMIN", "CONTENT_MANAGER"]}
                >
                  <ManageVocabsInVocabDeck />
                </ServerProtectRoutes>
              }
            />

            {/* Profile: tất cả user */}
            <Route
              path="/profile"
              element={
                <ServerProtectRoutes
                  rolesAllowed={[
                    "SUPER_ADMIN",
                    "USER_MANAGER",
                    "CONTENT_MANAGER",
                  ]}
                >
                  <Profile />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/my-dashboard"
              element={
                <ServerProtectRoutes
                  rolesAllowed={[
                    "SUPER_ADMIN",
                    "USER_MANAGER",
                    "CONTENT_MANAGER",
                  ]}
                >
                  <MyDashboard />
                </ServerProtectRoutes>
              }
            />

            {/* Settings: chỉ SUPER_ADMIN */}
            <Route
              path="/setting/gemini"
              element={
                <ServerProtectRoutes rolesAllowed={["SUPER_ADMIN"]}>
                  <GeminiSetting />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/setting/smtp"
              element={
                <ServerProtectRoutes rolesAllowed={["SUPER_ADMIN"]}>
                  <SmtpSetting />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/setting/youtube"
              element={
                <ServerProtectRoutes rolesAllowed={["SUPER_ADMIN"]}>
                  <YoutubeSetting />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/setting/news-api"
              element={
                <ServerProtectRoutes rolesAllowed={["SUPER_ADMIN"]}>
                  <NewsApiSetting />
                </ServerProtectRoutes>
              }
            />

            <Route
              path="/setting/cloudinary"
              element={
                <ServerProtectRoutes rolesAllowed={["SUPER_ADMIN"]}>
                  <CloudinarySetting />
                </ServerProtectRoutes>
              }
            />
          </Route>

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </HeaderProvider>
    </ServerAuthProvider>
  );
}

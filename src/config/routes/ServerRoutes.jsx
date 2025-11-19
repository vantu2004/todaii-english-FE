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

          <Route
            path="/dictionary"
            element={
              <ServerProtectRoutes>
                <ManageDictionary />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/dictionary-api"
            element={
              <ServerProtectRoutes>
                <DictionaryApi />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/news-api"
            element={
              <ServerProtectRoutes>
                <NewsApi />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/article-topic"
            element={
              <ServerProtectRoutes>
                <ManageTopics topicType="article" />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/topic/:id/article"
            element={
              <ServerProtectRoutes>
                <ArticlesInTopic />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/article"
            element={
              <ServerProtectRoutes>
                <ManageArticles />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/article/create"
            element={
              <ServerProtectRoutes>
                <CreateArticle />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/article/:id/update"
            element={
              <ServerProtectRoutes>
                <UpdateArticle />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/article/:id/paragraph"
            element={
              <ServerProtectRoutes>
                <ManageParagraphs />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/article/:id/vocab"
            element={
              <ServerProtectRoutes>
                <ManageVocabsInArticle />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/video-topic"
            element={
              <ServerProtectRoutes>
                <ManageTopics topicType="video" />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/topic/:id/video"
            element={
              <ServerProtectRoutes>
                <VideosInTopic />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/youtube"
            element={
              <ServerProtectRoutes>
                <Youtube />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/video"
            element={
              <ServerProtectRoutes>
                <ManageVideos />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/video/create"
            element={
              <ServerProtectRoutes>
                <CreateVideo />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/video/:id/update"
            element={
              <ServerProtectRoutes>
                <UpdateVideo />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/video/:id/lyric"
            element={
              <ServerProtectRoutes>
                <ManageLyrics />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/video/:id/vocab"
            element={
              <ServerProtectRoutes>
                <ManageVocabsInVideo />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/vocab-group"
            element={
              <ServerProtectRoutes>
                <ManageVocabGroups />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/vocab-group/:id/vocab-deck"
            element={
              <ServerProtectRoutes>
                <VocabDecksInGroup />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/vocab-deck"
            element={
              <ServerProtectRoutes>
                <ManageVocabDecks />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/vocab-deck/create"
            element={
              <ServerProtectRoutes>
                <CreateVocabDeck />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/vocab-deck/:id/update"
            element={
              <ServerProtectRoutes>
                <UpdateVocabDeck />
              </ServerProtectRoutes>
            }
          />

          <Route
            path="/vocab-deck/:id/vocab"
            element={
              <ServerProtectRoutes>
                <ManageVocabsInVocabDeck />
              </ServerProtectRoutes>
            }
          />
        </Route>
      </Routes>
    </ServerAuthProvider>
  );
}

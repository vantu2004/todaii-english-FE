import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import LandingPage from "./pages/LandingPage";
import ClientRoutes from "./config/routes/ClientRoutes";
import ServerRoutes from "./config/routes/ServerRoutes.jsx";
import { ClientAuthProvider } from "./context/clients/ClientAuthContext.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

const App = () => {
  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />

      <BrowserRouter>
        {/* giúp cuộn lên đầu trang khi chuyển route */}
        <ScrollToTop />

        <Routes>
          <Route
            path="/"
            element={
              <ClientAuthProvider>
                <LandingPage />
              </ClientAuthProvider>
            }
          />

          <Route path="/client/*" element={<ClientRoutes />} />
          <Route path="/server/*" element={<ServerRoutes />} />

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import LandingPage from "./pages/LandingPage";
import ClientRoutes from "./config/routes/ClientRoutes";
import ServerRoutes from "./config/routes/ServerRoutes.jsx";

const App = () => {
  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/client/*" element={<ClientRoutes />} />
          <Route path="/server/*" element={<ServerRoutes />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ClientRoutes from "./config/routes/ClientRoutes";
import AdminRoutes from "./config/routes/AdminRoutes";

const App = () => {
  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          {/* Mặc định khi chạy port từ console thì nó chuyển hướng về /client */}
          <Route path="/" element={<Navigate to={"/client"} />} />

          <Route path="/client/*" element={<ClientRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

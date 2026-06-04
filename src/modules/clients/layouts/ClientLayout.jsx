import { Outlet, Link, useLocation } from "react-router-dom";
import Footer from "@/components/landing_page/Footer";
import ClientNavBar from "@/components/clients/ClientNavBar";
import FloatingChatbot from "@/components/clients/chatbot/FloatingChatbot";

const ClientLayout = () => {
  const location = useLocation();
  const isTakingTest = location.pathname.endsWith("/take");
  const isNotebook = location.pathname.includes("/notebook");
  const hideFooterAndChatbot = isTakingTest || isNotebook;

  return (
    <div className="font-inter min-h-screen bg-surface-primary dark:bg-neutral-950 flex flex-col">
      <ClientNavBar />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {!hideFooterAndChatbot && <Footer />}

      {/* Floating AI Assistant */}
      {!hideFooterAndChatbot && <FloatingChatbot />}
    </div>
  );
};

export default ClientLayout;

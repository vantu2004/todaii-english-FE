import { Outlet, Link, useLocation } from "react-router-dom";
import Footer from "@/components/landing_page/Footer";
import ClientNavBar from "@/components/clients/ClientNavBar";
import FloatingChatbot from "@/components/clients/chatbot/FloatingChatbot";
import { useStudyTracker } from "@/hooks/clients/useStudyTracker";

const ClientLayout = () => {
  const location = useLocation();
  const isTakingTest = location.pathname.includes("/toeic/exam");
  const isResultReview = location.pathname.includes("/toeic/result-detail");
  const isNotebook = location.pathname.includes("/notebook");
  const hideFooter = isTakingTest || isResultReview || isNotebook;

  // Track study time
  useStudyTracker();

  return (
    <div className="font-inter min-h-screen bg-surface-primary dark:bg-neutral-950 flex flex-col">
      <ClientNavBar />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {!hideFooter && <Footer />}

      <FloatingChatbot />
    </div>
  );
};

export default ClientLayout;

import { Outlet, Link, useLocation } from "react-router-dom";
import Footer from "@/components/landing_page/Footer";
import ClientNavBar from "@/components/clients/ClientNavBar";

const ClientLayout = () => {
  const location = useLocation();
  const isTakingTest = location.pathname.endsWith("/take");

  return (
    <div className="font-inter min-h-screen bg-surface-primary dark:bg-neutral-950 flex flex-col">
      <ClientNavBar />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {!isTakingTest && <Footer />}
    </div>
  );
};

export default ClientLayout;

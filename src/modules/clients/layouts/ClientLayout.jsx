import { Outlet, Link } from "react-router-dom";
import Footer from "@/components/landing_page/Footer";
import ClientNavBar from "@/components/clients/ClientNavBar";

const ClientLayout = () => {
  return (
    <div className="font-inter min-h-screen bg-surface-primary dark:bg-neutral-950 flex flex-col">
      <ClientNavBar />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default ClientLayout;

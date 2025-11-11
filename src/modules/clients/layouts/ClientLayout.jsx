import { Outlet, Link } from "react-router-dom";
import Footer from "../../../components/landing_page/Footer";
import ClientNavBar from "../../../components/clients/ClientNavBar";

const ClientLayout = () => {
  return (
    <div className="font-inter h-screen bg-stale-50 dark:bg-gray-900">
       <ClientNavBar/>
      <main>
        <Outlet />
      </main>

      <Footer/>

    </div>
  );
}

export default ClientLayout;
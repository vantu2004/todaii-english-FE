import Navbar from "../components/clients/landing_page/Navbar";
import Hero from "../components/clients/landing_page/Hero";
import PopularCourses from "../components/clients/landing_page/PopularCourses";
import Footer from "../components/clients/landing_page/Footer";

function LandingPage() {
  return (
    <div className="font-jarkata-sans overflow-hidden relative bg-gradient-to-b from-white to-[#F0F1FF]">
      <Navbar />
      <Hero />
      <PopularCourses />
      <Footer />
    </div>
  );
}

export default LandingPage;

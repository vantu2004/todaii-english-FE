import Navbar from '../components/common/Navbar.jsx';
import Hero from '../components/landing_page/Hero.jsx';
import PopularCourses from '../components/landing_page/PopularCourses.jsx';
import Footer from '../components/common/Footer.jsx';

function LandingPage() {
  return (
    <div className="font-jarkata-sans overflow-x-hidden relative bg-gradient-to-b from-white to-[#F0F1FF]">
      <Navbar />
      <Hero />
      <PopularCourses />
      <Footer />
    </div>
  );
}

export default LandingPage;

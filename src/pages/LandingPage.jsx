import Navbar from "@/components/landing_page/Navbar";
import Hero from "@/components/landing_page/Hero";
import PopularCourses from "@/components/landing_page/PopularCourses";
import Testimonials from "@/components/landing_page/Testimonials";
import CTABanner from "@/components/landing_page/CTABanner";
import Footer from "@/components/landing_page/Footer";

function LandingPage() {
  return (
    <div className="font-jarkata-sans min-h-screen bg-surface-primary dark:bg-neutral-950 text-text-primary dark:text-neutral-100 selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-100 overflow-x-hidden relative transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <PopularCourses />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;

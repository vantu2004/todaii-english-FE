import { motion } from "framer-motion";
import { fadeIn } from "@/animations/fadeIn";
import { slideUp } from "@/animations/slideUp";
import { staggerContainer } from "@/animations/staggerContainer";
import HeroDeskTop from "@/assets/img/landing_page/image-hero-desktop.webp";
import HeroTablet from "@/assets/img/landing_page/image-hero-tablet.webp";
import HeroMobile from "@/assets/img/landing_page/image-hero-mobile.webp";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="max-[740px]:mt-20 min-h-screen relative pt-20 flex items-center"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-brand-100/50 dark:bg-brand-900/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-accent-500/10 dark:bg-accent-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex max-[740px]:flex-col items-center justify-between">
          {/* Left content */}
          <motion.div
            variants={slideUp(0.1)}
            className="flex flex-col items-start z-10"
          >
            <motion.h1
              variants={slideUp(0.2)}
              className="min-[932px]:max-lg:w-[90%] min-[1024px]:max-[1400px]:w-[80%] min-[740px]:max-[932px]:w-full max-[740px]:text-4xl leading-[1.15] text-neutral-900 dark:text-white text-[56px] font-semibold tracking-tight"
            >
              Learn English smart, with Todaii English
            </motion.h1>

            <motion.p
              variants={fadeIn(0.4)}
              className="min-[932px]:max-lg:w-[55%] min-lg:max-[1400px]:w-[60%] max-[932px]:w-full w-[76%] text-text-secondary text-lg leading-relaxed mt-6"
            >
              A web platform designed to help learners improve English
              proficiency through accessible, well-structured, and engaging
              content.
            </motion.p>

            <motion.div
              variants={slideUp(0.6)}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button 
                onClick={() => navigate('/client')}
                className="text-white text-base font-semibold cursor-pointer landing-gradient px-8 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(255,111,72,0.25)] dark:shadow-[0_4px_14px_rgba(255,111,72,0.15)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started Free
              </button>
              
              <button 
                onClick={() => {
                  const coursesSection = document.getElementById('popular-courses');
                  if (coursesSection) coursesSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-neutral-700 dark:text-neutral-300 text-base font-medium cursor-pointer bg-transparent border border-neutral-200 dark:border-neutral-700 px-8 py-3.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300"
              >
                Explore Courses
              </button>
            </motion.div>
          </motion.div>

          {/* Right image (Desktop / Tablet / Mobile) */}
          <motion.div
            variants={fadeIn(0.3)}
            className="-mr-132 -mt-40 max-[1400px]:hidden z-0"
          >
            <img src={HeroDeskTop} className="max-w-none dark:brightness-90 transition-all" alt="hero desktop" />
          </motion.div>

          <motion.div
            variants={fadeIn(0.3)}
            className="hidden max-[1400px]:block max-[1400px]:-mr-92 max-xl:-mr-80 max-[1400px]:-mt-24 max-[740px]:hidden z-0"
          >
            <img src={HeroTablet} className="max-w-none dark:brightness-90 transition-all" alt="hero tablet" />
          </motion.div>

          <motion.div
            variants={fadeIn(0.3)}
            className="max-[740px]:block max-[740px]:mt-12 hidden w-full z-0"
          >
            <img
              src={HeroMobile}
              className="w-full dark:brightness-90 transition-all"
              alt="hero mobile"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;

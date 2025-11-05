import { motion } from "framer-motion";
import { fadeIn } from "../../../../animations/fadeIn";
import { slideUp } from "../../../../animations/slideUp";
import { staggerContainer } from "../../../../animations/staggerContainer";
import HeroDeskTop from "../../../../assets/img/landing_page/image-hero-desktop.webp";
import HeroTablet from "../../../../assets/img/landing_page/image-hero-tablet.webp";
import HeroMobile from "../../../../assets/img/landing_page/image-hero-mobile.webp";

const Hero = () => {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="max-[740px]:mt-12"
    >
      <div className="w-[90%] max-w-275 ml-auto mr-auto">
        <div className="flex max-[740px]:flex-col items-center justify-between">
          {/* Left content */}
          <motion.div
            variants={slideUp(0.1)}
            className="flex flex-col items-start"
          >
            <motion.h1
              variants={slideUp(0.2)}
              className="min-[932px]:max-lg:w-[90%] min-[1024px]:max-[1400px]:w-[80%] min-[740px]:max-[932px]:w-full max-[740px]:text-[40px] leading-[1.2] text-[#13183f] text-[56px] font-extrabold"
            >
              Maximize skill, minimize budget
            </motion.h1>

            <motion.p
              variants={fadeIn(0.4)}
              className="min-[932px]:max-lg:w-[55%] min-lg:max-[1400px]:w-[60%] max-[932px]:w-full w-[76%] text-[#83869a] text-[18px] font-medium leading-[28px] mt-8"
            >
              Our modern courses across a range of in-demand skills will give
              you the knowledge you need to live the life you want.
            </motion.p>

            <motion.a
              variants={slideUp(0.6)}
              href="#"
              className="mt-8 inline-block"
            >
              <button className="text-white text-[18px] font-bold cursor-pointer bg-gradient-to-b from-[#FF6F48] to-[#F02AA6] w-[167px] h-[53px] border-none rounded-[31px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] transition-opacity duration-200 ease-in hover:opacity-80">
                Get Started
              </button>
            </motion.a>
          </motion.div>

          {/* Right image (Desktop / Tablet / Mobile) */}
          <motion.div
            variants={fadeIn(0.3)}
            className="-mr-132 -mt-60 max-[1400px]:hidden"
          >
            <img src={HeroDeskTop} className="max-w-none" alt="hero desktop" />
          </motion.div>

          <motion.div
            variants={fadeIn(0.3)}
            className="hidden max-[1400px]:block max-[1400px]:-mr-92 max-xl:-mr-80 max-[1400px]:-mt-24 max-[740px]:hidden"
          >
            <img src={HeroTablet} className="max-w-none" alt="hero tablet" />
          </motion.div>

          <motion.div
            variants={fadeIn(0.3)}
            className="max-[740px]:block max-[740px]:mt-8 hidden"
          >
            <img
              src={HeroMobile}
              className="min-[360px]:w-full"
              alt="hero mobile"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;

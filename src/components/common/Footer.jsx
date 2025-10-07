import { motion } from "framer-motion";
import { slideUp } from "../../animations/slideUp.js";
import { fadeIn } from "../../animations/fadeIn.js";
import LogoLight from "../../assets/landing_page/logo-light.svg";

const Footer = () => {
  // hello world
  return (
    <motion.footer
      variants={fadeIn(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="bg-[#13183f] py-4"
    >
      <motion.div
        variants={slideUp(0.2)}
        className="w-[90%] max-w-[1100px] ml-auto mr-auto"
      >
        <div className="flex justify-between items-center">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={LogoLight} alt="skilled logo light" />
          </motion.a>

          <motion.a
            href="#"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <button className="max-[320px]:w-32 max-[320px]:h-10 max-[320px]:text-[14px] w-40 h-14 text-[18px] bg-gradient-to-b from-[#4851FF] to-[#F02AA6] text-white px-6 py-3 rounded-full font-bold shadow-md hover:opacity-80 transition">
              Get Started
            </button>
          </motion.a>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;

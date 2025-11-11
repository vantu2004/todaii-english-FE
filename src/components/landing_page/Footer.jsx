import { motion } from "framer-motion";
import { slideUp } from "../../animations/slideUp.js";
import { fadeIn } from "../../animations/fadeIn.js";

const Footer = () => {
  return (
    <motion.footer
      variants={fadeIn(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="bg-[#13183f] text-white py-10"
    >
      <motion.div
        variants={slideUp(0.2)}
        className="w-[90%] max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
      >
        {/* Logo + tagline */}
        <div>
          <a
            href="/"
            className="text-2xl font-extrabold tracking-tight select-none"
          >
            <span className="text-white">Todaii</span>
            <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F48] to-[#F02AA6]">
              English
            </span>
          </a>
          <p className="text-sm text-gray-400 mt-1">
            Learn smarter. Grow stronger every day.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>
        </div>
      </motion.div>

      {/* Divider line */}
      <div className="w-[90%] max-w-[1100px] mx-auto mt-6 border-t border-white/10 pt-4 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Todaii English. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;

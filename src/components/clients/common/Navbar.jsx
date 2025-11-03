import { motion } from "framer-motion";
import { slideDown } from "../../../animations/slideDown";
import LogoDark from "../../../assets/img/landing_page/logo-dark.svg";

const Navbar = () => {
  return (
    <motion.nav
      variants={slideDown(0.1)}
      initial="hidden"
      animate="show"
      className="w-[90%] max-w-[1100px] ml-auto mr-auto"
    >
      <div className="flex justify-between items-center mt-4">
        <motion.a
          href="#"
          variants={slideDown(0.3)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img src={LogoDark} alt="skilled logo" />
        </motion.a>

        <motion.a
          href="#"
          variants={slideDown(0.5)}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <button className="max-[320px]:w-32 max-[320px]:h-10 max-[320px]:text-[14px] font-bold text-white text-[18px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] w-[167px] h-[56px] bg-[#13183f] rounded-[28px] hover:opacity-80 transition">
            Get Started
          </button>
        </motion.a>
      </div>
    </motion.nav>
  );
};

export default Navbar;

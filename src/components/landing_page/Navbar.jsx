import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "glass-panel border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo text */}
          <a
            href="/"
            className="text-2xl font-extrabold tracking-tight select-none flex items-center"
          >
            <span className="text-neutral-900 dark:text-white">Todaii</span>
            <span className="ml-1 text-brand-500">
              English
            </span>
          </a>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/server/login")}
              className="px-5 py-2.5 rounded-xl font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/client")}
              className="px-5 py-2.5 rounded-xl font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-2 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 glass-panel border-b border-neutral-200/50 dark:border-neutral-800/50 py-5 px-4 shadow-xl flex flex-col gap-3"
          >
            <button
              onClick={() => {
                navigate("/client/login");
                setOpen(false);
              }}
              className="w-full py-3 rounded-xl font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                navigate("/server/login");
                setOpen(false);
              }}
              className="w-full py-3 rounded-xl font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200"
            >
              Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

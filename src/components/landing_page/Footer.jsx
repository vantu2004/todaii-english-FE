import { motion } from "framer-motion";
import { slideUp } from "@/animations/slideUp.js";
import { fadeIn } from "@/animations/fadeIn.js";
import { Github, Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      variants={fadeIn(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="bg-neutral-900 dark:bg-black text-neutral-400 py-16 border-t border-neutral-800"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={slideUp(0.2)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <a
              href="/"
              className="text-2xl font-extrabold tracking-tight select-none flex items-center mb-4"
            >
              <span className="text-white">Todaii</span>
              <span className="ml-1 text-brand-500">
                English
              </span>
            </a>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              A premium platform designed to help learners improve English proficiency through accessible, well-structured, and engaging content.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Teachers</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </motion.div>

        {/* Divider & Copyright */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Todaii English. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span>Designed with</span>
            <span className="text-red-500">♥</span>
            <span>for learners globally.</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

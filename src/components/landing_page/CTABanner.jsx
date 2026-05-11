import { motion } from "framer-motion";
import { slideUp } from "@/animations/slideUp.js";
import { useNavigate } from "react-router-dom";

const CTABanner = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      variants={slideUp(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="py-24 bg-surface-primary dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden landing-gradient p-10 sm:p-16 text-center shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to elevate your English?
            </h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl font-medium leading-relaxed">
              Join our community of learners and start your journey towards fluency today. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => navigate('/client')}
                className="px-8 py-4 rounded-xl font-bold bg-white text-brand-600 hover:bg-neutral-50 shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                Start Learning Free
              </button>
              <button 
                onClick={() => navigate('/server/login')}
                className="px-8 py-4 rounded-xl font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300"
              >
                Teacher Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTABanner;

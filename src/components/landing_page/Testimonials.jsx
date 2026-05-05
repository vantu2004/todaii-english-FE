import { motion } from "framer-motion";
import { fadeIn } from "../../animations/fadeIn.js";
import { slideUp } from "../../animations/slideUp.js";
import { staggerContainer } from "../../animations/staggerContainer.js";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "IELTS Student",
    content: "Todaii English transformed my study routine. The personalized vocabulary builder helped me score an 8.0 in reading!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content: "The listening exercises with synced transcripts are incredible. My pronunciation has improved dramatically in just 2 months.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=michael"
  },
  {
    name: "Elena Rodriguez",
    role: "Business Analyst",
    content: "I love the editorial approach. Learning grammar through real-world news articles makes it so much easier to understand context.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
];

const Testimonials = () => {
  return (
    <motion.section
      variants={fadeIn(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="py-24 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-brand-500/30" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500">
              Student Success
            </h2>
            <div className="h-px w-8 bg-brand-500/30" />
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Trusted by learners globally
          </h3>
        </div>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={slideUp(index * 0.15)}
              className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-8 border border-neutral-100 dark:border-neutral-700/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-500 text-accent-500" />
                ))}
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-neutral-800"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Testimonials;

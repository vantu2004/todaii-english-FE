import { motion } from "framer-motion";
import { fadeIn } from "../../animations/fadeIn.js";
import { slideUp } from "../../animations/slideUp.js";

import { BookOpen, BookMarked, Headphones, Mic, FileText } from "lucide-react";
import CourseBox from "./CourseBox.jsx";

const courses = [
  {
    title: "Reading Practice",
    icon: <BookOpen className="w-7 h-7" />,
    desc: "Improve comprehension with bilingual articles and contextual explanations tailored to your level.",
  },
  {
    title: "Vocabulary Builder",
    icon: <BookMarked className="w-7 h-7" />,
    desc: "Expand your vocabulary effectively with smart flashcards, spaced repetition, and real examples.",
  },
  {
    title: "Listening & Pronunciation",
    icon: <Headphones className="w-7 h-7" />,
    desc: "Train your ears and accent through audio lessons and song-based exercises synced with lyrics.",
  },
  {
    title: "Speaking Skills",
    icon: <Mic className="w-7 h-7" />,
    desc: "Gain confidence in communication with guided practice, dialogues, and pronunciation feedback.",
  },
  {
    title: "Grammar Essentials",
    icon: <FileText className="w-7 h-7" />,
    desc: "Master key grammar points with short, clear lessons and practical examples you can use instantly.",
  },
];

const PopularCourses = () => {
  return (
    <motion.section
      id="popular-courses"
      variants={fadeIn(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="py-24 bg-surface-secondary dark:bg-neutral-900/40 border-t border-neutral-100 dark:border-neutral-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-500">
                Core Features
              </h2>
              <div className="h-px w-12 bg-brand-500/30" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Discover Key Learning Areas
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Gradient Highlight Box */}
          <motion.div
            variants={slideUp(0.2)}
            className="w-full h-full min-h-[280px] rounded-2xl landing-gradient p-8 flex flex-col justify-end shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight z-10">
              Check out our most popular courses!
            </h2>
            <p className="text-white/90 mt-4 text-sm z-10 leading-relaxed font-medium">
              Join thousands of learners worldwide who have improved their English with our structured programs.
            </p>
          </motion.div>

          {/* Course Boxes */}
          {courses.map((course, index) => (
            <motion.div
              key={index}
              variants={slideUp(index * 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="h-full"
            >
              <CourseBox course={course} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default PopularCourses;

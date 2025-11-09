import { motion } from "framer-motion";
import { fadeIn } from "../../../animations/fadeIn.js";
import { slideUp } from "../../../animations/slideUp.js";

import { BookOpen, BookMarked, Headphones, Mic, FileText } from "lucide-react";
import CourseBox from "./CourseBox.jsx";

const courses = [
  {
    title: "Reading Practice",
    icon: <BookOpen className="w-10 h-10" />,
    desc: "Improve comprehension with bilingual articles and contextual explanations tailored to your level.",
  },
  {
    title: "Vocabulary Builder",
    icon: <BookMarked className="w-10 h-10" />,
    desc: "Expand your vocabulary effectively with smart flashcards, spaced repetition, and real examples.",
  },
  {
    title: "Listening & Pronunciation",
    icon: <Headphones className="w-10 h-10" />,
    desc: "Train your ears and accent through audio lessons and song-based exercises synced with lyrics.",
  },
  {
    title: "Speaking Skills",
    icon: <Mic className="w-10 h-10" />,
    desc: "Gain confidence in communication with guided practice, dialogues, and pronunciation feedback.",
  },
  {
    title: "Grammar Essentials",
    icon: <FileText className="w-10 h-10" />,
    desc: "Master key grammar points with short, clear lessons and practical examples you can use instantly.",
  },
];

const PopularCourses = () => {
  return (
    <motion.section
      variants={fadeIn(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mt-20 mb-40"
    >
      <div className="w-[90%] max-w-275 ml-auto mr-auto">
        <h2 className="text-4xl font-extrabold text-[#13183f] mb-12">
          Discover Key Learning Areas
        </h2>

        <div className="grid max-[1400px]:grid-cols-2 max-[850px]:grid-cols-1 grid-cols-3 gap-y-14 gap-x-6 justify-items-center">
          {/* Gradient Header Box */}
          <motion.div
            variants={slideUp(0.2)}
            className="w-87 min-[740px]:max-[850px]:h-50 max-[740px]:h-70 max-[850px]:w-full h-80 rounded-xl bg-gradient-to-b from-[#FF6F48] to-[#F02AA6] items-center"
          >
            <h2 className="max-[850px]:w-[65%] w-[90%] text-[32px] pl-[1.3rem] font-extrabold pt-16 text-white">
              Check out our most popular courses!
            </h2>
          </motion.div>

          {/* Course Boxes */}
          {courses.map((course, index) => (
            <motion.div
              key={index}
              variants={slideUp(index * 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
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

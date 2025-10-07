import { motion } from "framer-motion";
import { fadeIn } from "../../animations/fadeIn.js";
import { slideUp } from "../../animations/slideUp.js";

import Animation from "../../assets/landing_page/icon-animation.svg";
import Design from "../../assets/landing_page/icon-design.svg";
import Photography from "../../assets/landing_page/icon-photography.svg";
import Crypto from "../../assets/landing_page/icon-crypto.svg";
import Business from "../../assets/landing_page/icon-business.svg";
import CourseBox from "./CourseBox";

const courses = [
  {
    title: "Animation",
    icon: Animation,
    desc: "Learn the latest animation techniques to create stunning motion design and captivate your audience.",
  },
  {
    title: "Design",
    icon: Design,
    desc: "Create beautiful, usable interfaces to help shape the future of how the web looks.",
  },
  {
    title: "Photography",
    icon: Photography,
    desc: "Explore critical fundamentals like lighting, composition, and focus to capture exceptional photos.",
  },
  {
    title: "Crypto",
    icon: Crypto,
    desc: "All you need to know to get started investing in crypto. Go from beginner to advanced with this 54 hour course.",
  },
  {
    title: "Business",
    icon: Business,
    desc: "A step-by-step playbook to help you start, scale, and sustain your business without outside investment.",
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

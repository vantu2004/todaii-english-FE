const CourseBox = ({ course }) => {
  return (
    <div className="relative w-87 h-80 min-[850px]:max-lg:w-85 max-[850px]:w-full max-[360px]:h-90 bg-white rounded-xl shadow-md">
      <div className="relative left-5 -top-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FF6F48] to-[#F02AA6] flex items-center justify-center shadow-md">
          {/* icon màu trắng cho nổi bật trên nền gradient */}
          <div className="text-white">{course.icon}</div>
        </div>
      </div>

      <div className="pt-4 pl-7">
        <h3 className="text-2xl font-extrabold text-[#13183f] mb-6">
          {course.title}
        </h3>
        <p className="max-[850px]:w-[70%] w-[90%] text-[#83869a] font-medium text-lg leading-7">
          {course.desc}
        </p>
      </div>
    </div>
  );
};

export default CourseBox;

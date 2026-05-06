const CourseBox = ({ course }) => {
  return (
    <div className="group relative w-full h-full min-h-[280px] bg-white dark:bg-neutral-800/50 rounded-2xl p-6 lg:p-8 border border-neutral-100 dark:border-neutral-700/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="w-14 h-14 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 text-brand-500">
        {course.icon}
      </div>

      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 group-hover:text-brand-500 transition-colors">
        {course.title}
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed flex-grow">
        {course.desc}
      </p>
    </div>
  );
};

export default CourseBox;

const ChartContainer = ({ title, subtitle, children, className = "" }) => (
  <div
    className={`bg-white dark:bg-neutral-900 rounded-xl p-6 ring-1 ring-neutral-200/60 dark:ring-neutral-800 h-full flex flex-col shadow-sm ${className}`}
  >
    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
      {title}
    </h3>
    {subtitle && (
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
        {subtitle}
      </p>
    )}
    <div className="relative w-full h-64 md:h-80 flex items-center justify-center flex-1">
      {children}
    </div>
  </div>
);

export default ChartContainer;

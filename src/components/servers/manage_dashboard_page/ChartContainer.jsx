const ChartContainer = ({ title, subtitle, children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full ${className}`}
  >
    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
      {title}
    </h3>
    {subtitle && <p className="text-xs text-gray-500 mb-6">{subtitle}</p>}
    <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
      {children}
    </div>
  </div>
);

export default ChartContainer;

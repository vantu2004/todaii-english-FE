const SummaryCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex items-center border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-full mr-4 ${bgClass} ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
        {value?.toLocaleString() || 0}
      </p>
    </div>
  </div>
);

export default SummaryCard;

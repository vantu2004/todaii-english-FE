import { Link } from "react-router-dom";

const SummaryCard = ({
  title,
  value,
  redirectTo,
  icon: Icon,
  colorClass,
  bgClass,
}) => (
  <Link to={redirectTo}>
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 flex items-center ring-1 ring-neutral-200 dark:ring-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer">
      <div className={`p-3 rounded-xl mr-4 ${bgClass} ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {title}
        </p>
        <p className="text-2xl font-semibold tracking-tight tabular-nums text-neutral-900 dark:text-white mt-1">
          {value?.toLocaleString() || 0}
        </p>
      </div>
    </div>
  </Link>
);

export default SummaryCard;

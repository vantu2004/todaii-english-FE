import { Link } from "react-router-dom";

const SummaryCard = ({
  title,
  value,
  redirectTo,
  icon: Icon,
  colorClass,
  bgClass,
}) => (
  <Link to={redirectTo} className="block group">
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 flex items-center ring-1 ring-neutral-200/60 dark:ring-neutral-800 hover:shadow-md hover:ring-neutral-200 dark:hover:ring-neutral-700 transition-all cursor-pointer">
      <div
        className={`p-3.5 rounded-xl mr-4 ${bgClass} ${colorClass} transition-colors`}
      >
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
          {title}
        </p>
        <p className="text-2xl font-bold tracking-tight tabular-nums text-neutral-900 dark:text-white mt-0.5">
          {(value ?? 0).toLocaleString()}
        </p>
      </div>
    </div>
  </Link>
);

export default SummaryCard;

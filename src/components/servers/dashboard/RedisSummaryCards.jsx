import {
  Terminal,
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  HardDrive,
  Activity,
} from "lucide-react";
import { formatBytes, formatNumber } from "@/utils/redisTransform";

const RedisSummaryCard = ({ label, value, icon: Icon, loading }) => {
  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-900 border-gray-250 dark:border-gray-800 rounded-lg animate-pulse min-h-[96px] flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-850 rounded"></div>
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-850 rounded"></div>
        </div>
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-850 rounded mt-2"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-all select-none">
      <div>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 block mb-1">
          {label}
        </span>
        <span className="text-xl font-semibold text-gray-900 dark:text-white">
          {value !== undefined && value !== null ? value : "—"}
        </span>
      </div>
      <div className="p-2 bg-gray-50 dark:bg-gray-850 rounded-lg text-gray-400 border border-gray-100 dark:border-gray-800 flex items-center justify-center">
        <Icon size={16} />
      </div>
    </div>
  );
};

const RedisSummaryCards = ({ data, loading }) => {
  const cards = [
    {
      label: "Daily Commands",
      value:
        (data?.daily_net_commands ?? data?.dailyNetCommands) !== undefined
          ? (
              data?.daily_net_commands ?? data?.dailyNetCommands
            ).toLocaleString()
          : null,
      icon: Terminal,
    },
    {
      label: "Daily Reads",
      value:
        (data?.daily_read_requests ?? data?.dailyReadRequests) !== undefined
          ? (
              data?.daily_read_requests ?? data?.dailyReadRequests
            ).toLocaleString()
          : null,
      icon: ArrowDownToLine,
    },
    {
      label: "Daily Writes",
      value:
        (data?.daily_write_requests ?? data?.dailyWriteRequests) !== undefined
          ? (
              data?.daily_write_requests ?? data?.dailyWriteRequests
            ).toLocaleString()
          : null,
      icon: ArrowUpFromLine,
    },
    {
      label: "Monthly Requests",
      value:
        (data?.total_monthly_requests ?? data?.totalMonthlyRequests) !==
        undefined
          ? formatNumber(
              data?.total_monthly_requests ?? data?.totalMonthlyRequests,
            )
          : null,
      icon: Calendar,
    },
    {
      label: "Storage Used",
      value:
        (data?.current_storage ?? data?.currentStorage) !== undefined
          ? formatBytes(data?.current_storage ?? data?.currentStorage)
          : null,
      icon: HardDrive,
    },
    {
      label: "Daily Bandwidth",
      value:
        (data?.daily_bandwidth ?? data?.dailyBandwidth) !== undefined
          ? formatBytes(data?.daily_bandwidth ?? data?.dailyBandwidth)
          : null,
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card, idx) => (
        <RedisSummaryCard
          key={idx}
          label={card.label}
          value={card.value}
          icon={card.icon}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default RedisSummaryCards;

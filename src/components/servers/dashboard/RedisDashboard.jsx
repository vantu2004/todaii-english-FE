import { useRedisStats } from "@/hooks/servers/useRedisStats";
import RedisSummaryCards from "./RedisSummaryCards";
import StorageSection from "./redis/StorageSection";
import TrafficSection from "./redis/TrafficSection";
import CachePerformanceSection from "./redis/CachePerformanceSection";
import LatencySection from "./redis/LatencySection";
import CommandBreakdownSection from "./redis/CommandBreakdownSection";
import { RefreshCw, AlertCircle } from "lucide-react";

const RedisDashboard = () => {
  const { data, loading, error, refresh } = useRedisStats();

  return (
    <div className="flex flex-col space-y-6">
      {/* Header bar with manual refresh button */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upstash Redis Statistics
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time monitoring of cache performance, command throughput,
            storage, and database latency.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && !data && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle size={20} className="shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">Failed to load Redis statistics</p>
            <p className="text-xs opacity-90 mt-0.5">
              Please check backend database connection or try refreshing.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <RedisSummaryCards data={data} loading={loading && !data} />

      {/* Stats Sections */}
      {data && (
        <div className="space-y-6">
          <StorageSection redisData={data} />
          <TrafficSection redisData={data} />
          <CachePerformanceSection redisData={data} />
          <LatencySection redisData={data} />
          <CommandBreakdownSection redisData={data} />
        </div>
      )}
    </div>
  );
};

export default RedisDashboard;

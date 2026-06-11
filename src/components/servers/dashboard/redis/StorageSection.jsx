import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  parseTimestamp,
  checkAllSameDay,
  formatTimestampLabel,
  formatBytes,
} from "@/utils/redisTransform";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const StorageSection = ({ redisData }) => {
  const keyspaceData = redisData?.keyspace || [];
  const diskUsageData =
    redisData?.disk_usage || redisData?.diskusage || redisData?.diskUsage || [];

  if (keyspaceData.length === 0 && diskUsageData.length === 0) return null;

  // Parse dates to check span
  // Use keyspaceData if available, otherwise diskUsageData for parsedDates
  const baseData = keyspaceData.length > 0 ? keyspaceData : diskUsageData;
  const parsedDates = baseData.map((d) => parseTimestamp(d.x));
  const allSameDay = checkAllSameDay(parsedDates);
  const labels = parsedDates.map((d) => formatTimestampLabel(d, allSameDay));

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          color: "#9ca3af",
          font: { size: 11 },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(156, 163, 175, 0.05)" },
        ticks: { color: "#9ca3af", font: { size: 10 } },
      },
      y: {
        grid: { color: "rgba(156, 163, 175, 0.05)" },
        ticks: { color: "#9ca3af", font: { size: 10 } },
      },
    },
  };

  const keyspaceChartData = {
    labels,
    datasets: [
      {
        label: "Keyspace (Keys Count)",
        data: keyspaceData.map((d) => d.y),
        borderColor: "#3b82f6", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.15,
        fill: false,
      },
    ],
  };

  const diskUsageChartData = {
    labels,
    datasets: [
      {
        label: "Disk Usage (MB)",
        data: diskUsageData.map((d) => (d.y || 0) / (1024 * 1024)), // convert to MB
        borderColor: "#10b981", // emerald-500
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.15,
        fill: true,
      },
    ],
  };

  const diskOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        callbacks: {
          label: function (context) {
            const rawBytes = diskUsageData[context.dataIndex]?.y || 0;
            return `Disk Usage: ${formatBytes(rawBytes)}`;
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Keyspace */}
      {keyspaceData.length > 0 && (
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[300px]">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 block">
            Keyspace
          </h3>
          <div className="flex-1 relative">
            <Line data={keyspaceChartData} options={commonOptions} />
          </div>
        </div>
      )}

      {/* Disk Usage */}
      {diskUsageData.length > 0 && (
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[300px]">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 block">
            Disk Usage
          </h3>
          <div className="flex-1 relative">
            <Line data={diskUsageChartData} options={diskOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageSection;

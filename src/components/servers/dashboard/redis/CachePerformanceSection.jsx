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
  buildHitRate,
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

const CachePerformanceSection = ({ redisData }) => {
  const hitsData = redisData?.hits || [];
  const missesData = redisData?.misses || [];

  if (hitsData.length === 0 && missesData.length === 0) return null;

  const parsedDates = hitsData.map((d) => parseTimestamp(d.x));
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

  const hitsMissesChartData = {
    labels,
    datasets: [
      {
        label: "Hits",
        data: hitsData.map((d) => d.y),
        borderColor: "#10b981", // green-500
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.15,
      },
      {
        label: "Misses",
        data: missesData.map((d) => d.y),
        borderColor: "#ef4444", // red-500
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.15,
      },
    ],
  };

  const hitRateData = buildHitRate(hitsData, missesData);
  const hitRateChartData = {
    labels,
    datasets: [
      {
        label: "Hit Rate (%)",
        data: hitRateData.map((d) => d.y),
        borderColor: "#8b5cf6", // purple-500
        backgroundColor: "rgba(139, 92, 246, 0.05)",
        borderWidth: 2,
        tension: 0.15,
        fill: true,
      },
    ],
  };

  const hitRateOptions = {
    ...commonOptions,
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        min: 0,
        max: 100,
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[300px]">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 block">
          Hits vs Misses
        </h3>
        <div className="flex-1 relative">
          <Line data={hitsMissesChartData} options={commonOptions} />
        </div>
      </div>

      <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[300px]">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 block">
          Hit Rate (%)
        </h3>
        <div className="flex-1 relative">
          <Line data={hitRateChartData} options={hitRateOptions} />
        </div>
      </div>
    </div>
  );
};

export default CachePerformanceSection;

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

const COMMAND_COLORS = [
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // purple-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#f97316", // orange-500
  "#6366f1", // indigo-500
];

const CommandBreakdownSection = ({ redisData }) => {
  const commandCounts =
    redisData?.command_counts ||
    redisData?.commandCounts ||
    redisData?.commandcounts ||
    [];

  if (commandCounts.length === 0) return null;

  // Gather dates using the first command's data points
  const firstCmd = commandCounts[0];
  const firstPoints = firstCmd?.data_points || firstCmd?.dataPoints || [];
  if (firstPoints.length === 0) return null;

  const parsedDates = firstPoints.map((d) => parseTimestamp(d.x));
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

  const datasets = commandCounts.map((cmd, idx) => {
    const color = COMMAND_COLORS[idx % COMMAND_COLORS.length];
    return {
      label: cmd.metric_identifier || cmd.metricIdentifier || "Unknown",
      data: (cmd.data_points || cmd.dataPoints || []).map((pt) => pt.y),
      borderColor: color,
      backgroundColor: "transparent",
      borderWidth: 2,
      tension: 0.15,
    };
  });

  const chartData = {
    labels,
    datasets,
  };

  return (
    <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[350px]">
      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 block">
        Command Breakdown over time
      </h3>
      <div className="flex-1 relative">
        <Line data={chartData} options={commonOptions} />
      </div>
    </div>
  );
};

export default CommandBreakdownSection;

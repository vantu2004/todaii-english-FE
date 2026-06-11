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

const LatencySection = ({ redisData }) => {
  const meanData =
    redisData?.latency_mean ||
    redisData?.latencymean ||
    redisData?.latencyMean ||
    [];
  const p99Data = redisData?.latency_99 || redisData?.latency99 || [];

  if (meanData.length === 0 && p99Data.length === 0) return null;

  const baseData = meanData.length > 0 ? meanData : p99Data;
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
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} ms`;
          },
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
        ticks: {
          color: "#9ca3af",
          font: { size: 10 },
          callback: (value) => `${value} ms`,
        },
      },
    },
  };

  const latencyChartData = {
    labels,
    datasets: [
      {
        label: "Mean Latency",
        data: meanData.map((d) => d.y),
        borderColor: "#3b82f6", // blue-500
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.15,
      },
      {
        label: "P99 Latency",
        data: p99Data.map((d) => d.y),
        borderColor: "#ef4444", // red-500
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.15,
      },
    ],
  };

  return (
    <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[350px]">
      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 block">
        Latency Profile (ms)
      </h3>
      <div className="flex-1 relative">
        <Line data={latencyChartData} options={commonOptions} />
      </div>
    </div>
  );
};

export default LatencySection;

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

const TrafficSection = ({ redisData }) => {
  const connectionData =
    redisData?.connection_count ||
    redisData?.connectionCount ||
    redisData?.connectioncount ||
    [];
  const throughputData = redisData?.throughput || [];

  if (connectionData.length === 0 && throughputData.length === 0) return null;

  const baseData = connectionData.length > 0 ? connectionData : throughputData;
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

  const connectionChartData = {
    labels,
    datasets: [
      {
        label: "Connection Count",
        data: connectionData.map((d) => d.y),
        borderColor: "#f59e0b", // amber-500
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 2,
        tension: 0.15,
        fill: false,
      },
    ],
  };

  const throughputChartData = {
    labels,
    datasets: [
      {
        label: "Throughput (Req/s)",
        data: throughputData.map((d) => d.y),
        borderColor: "#ec4899", // pink-500
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        borderWidth: 2,
        tension: 0.15,
        fill: true,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {connectionData.length > 0 && (
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[300px]">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 block">
            Connection Count
          </h3>
          <div className="flex-1 relative">
            <Line data={connectionChartData} options={commonOptions} />
          </div>
        </div>
      )}

      {throughputData.length > 0 && (
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[300px]">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 block">
            Throughput
          </h3>
          <div className="flex-1 relative">
            <Line
              data={throughputChartData}
              options={
                throughputChartData.datasets[0].fill
                  ? {
                      ...commonOptions,
                      plugins: {
                        ...commonOptions.plugins,
                        filler: { propagate: true },
                      },
                    }
                  : commonOptions
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficSection;

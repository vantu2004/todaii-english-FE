import { useMemo } from "react";
import { Cpu } from "lucide-react";
import ChartContainer from "./ChartContainer";
import { Line, Bar } from "react-chartjs-2";

const EVENT_COLORS = {
  DICTIONARY_API: "rgba(59, 130, 246, 0.8)", // Blue
  AI_REQUEST: "rgba(139, 92, 246, 0.8)", // Violet
  NEWSAPI_REQUEST: "rgba(236, 72, 153, 0.8)", // Pink
  YOUTUBE_SEARCH: "rgba(239, 68, 68, 0.8)", // Red
  CLOUDINARY_UPLOAD: "rgba(245, 158, 11, 0.8)", // Amber
  USER_LOGIN: "rgba(16, 185, 129, 0.8)", // Emerald
  ADMIN_ACTION: "rgba(99, 102, 241, 0.8)", // Indigo
  MAIL_SEND: "rgba(107, 114, 128, 0.8)", // Gray
};

const getUniqueDates = (logTrends) => {
  if (!logTrends) return [];
  const allDates = new Set();
  Object.values(logTrends).forEach((arr) =>
    arr.forEach((item) => allDates.add(item.date))
  );
  return Array.from(allDates).sort();
};

const AdminSection = ({ data }) => {
  // Logic xử lý dữ liệu Admin
  const usageChartData = useMemo(() => {
    if (!data?.log_trends) return null;
    const labels = getUniqueDates(data.log_trends);
    const datasets = Object.keys(data.log_trends).map((key) => ({
      label: key.replace("_", " "),
      data: labels.map(
        (date) =>
          data.log_trends[key].find((d) => d.date === date)?.quantity || 0
      ),
      borderColor: EVENT_COLORS[key] || "#999",
      backgroundColor: EVENT_COLORS[key] || "#999",
      tension: 0.3,
      borderWidth: 2,
    }));
    return { labels, datasets };
  }, [data]);

  const tokenChartData = useMemo(() => {
    if (!data?.ai_token_trends) return null;
    const dates = Object.keys(data.ai_token_trends).sort();
    const inputData = dates.map(
      (d) => data.ai_token_trends[d]?.[0]?.input_token || 0
    );
    const outputData = dates.map(
      (d) => data.ai_token_trends[d]?.[0]?.output_token || 0
    );

    return {
      labels: dates,
      datasets: [
        {
          label: "Input Tokens",
          data: inputData,
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          stack: "Stack 0",
        },
        {
          label: "Output Tokens",
          data: outputData,
          backgroundColor: "rgba(16, 185, 129, 0.6)",
          stack: "Stack 0",
        },
      ],
    };
  }, [data]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <Cpu size={20} /> System & 3rd Party Integrations (Admin)
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title="3rd Party Service Trends"
            subtitle="Daily request volume"
          >
            {usageChartData ? (
              <Line
                data={usageChartData}
                options={{ maintainAspectRatio: false, responsive: true }}
              />
            ) : (
              <p>No Data</p>
            )}
          </ChartContainer>
        </div>
        <div className="lg:col-span-1">
          <ChartContainer
            title="AI Token Consumption"
            subtitle="Input vs Output Tokens"
          >
            {tokenChartData ? (
              <Bar
                data={tokenChartData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: { x: { stacked: true }, y: { stacked: true } },
                }}
              />
            ) : (
              <p>No Data</p>
            )}
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminSection;

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Loader } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const DashboardCharts = ({ chartData, loading, activeTab }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <Loader className="w-8 h-8 text-gray-500 animate-spin mb-4" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Loading charts data...
        </span>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
        <span className="text-gray-400 dark:text-gray-600 mb-2">
          No data available
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your date range filter.
        </span>
      </div>
    );
  }

  const labels = chartData.map((d) => d.date);

  // Common Options
  const getCommonOptions = (title, displayLegend = true) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: displayLegend,
        position: "top",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          font: { size: 11 },
          color: "#9ca3af", // gray-400
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.05)",
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 10 },
        },
      },
      y: {
        grid: {
          color: "rgba(156, 163, 175, 0.05)",
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 10 },
        },
      },
    },
  });

  // 1. AI Requests Chart data and configuration
  // Find all unique combinations of ai_provider & model
  const aiCombinations = [];
  chartData.forEach((day) => {
    if (day.ai_requests) {
      day.ai_requests.forEach((req) => {
        const exists = aiCombinations.some(
          (c) => c.provider === req.ai_provider && c.model === req.model,
        );
        if (!exists) {
          aiCombinations.push({ provider: req.ai_provider, model: req.model });
        }
      });
    }
  });

  const getAIColor = (provider, index) => {
    const openAIColors = [
      "#10b981",
      "#059669",
      "#34d399",
      "#a7f3d0",
      "#047857",
    ];
    const geminiColors = [
      "#3b82f6",
      "#2563eb",
      "#60a5fa",
      "#bfdbfe",
      "#1d4ed8",
    ];
    const anthropicColors = [
      "#8b5cf6",
      "#7c3aed",
      "#a78bfa",
      "#ddd6fe",
      "#6d28d9",
    ];
    const otherColors = ["#6b7280", "#4b5563", "#9ca3af", "#e5e7eb", "#374151"];

    const p = provider ? provider.toLowerCase() : "";
    if (p.includes("openai")) {
      return openAIColors[index % openAIColors.length];
    } else if (p.includes("gemini") || p.includes("google")) {
      return geminiColors[index % geminiColors.length];
    } else if (p.includes("anthropic") || p.includes("claude")) {
      return anthropicColors[index % anthropicColors.length];
    } else {
      return otherColors[index % otherColors.length];
    }
  };

  const aiRequestsDatasets = aiCombinations.map((comb, index) => {
    const data = chartData.map((day) => {
      const match = day.ai_requests?.find(
        (r) => r.ai_provider === comb.provider && r.model === comb.model,
      );
      return match ? match.quantity : 0;
    });

    return {
      label: `${comb.provider || "Unknown"} (${comb.model || "Unknown"})`,
      provider: comb.provider,
      model: comb.model,
      data,
      backgroundColor: getAIColor(comb.provider, index),
      stack: "Stack0",
    };
  });

  const findRequestData = (dateIndex, provider, model) => {
    const dayData = chartData[dateIndex];
    if (!dayData?.ai_requests) return null;
    return dayData.ai_requests.find(
      (req) => req.ai_provider === provider && req.model === model,
    );
  };

  const aiRequestsOptions = {
    ...getCommonOptions("AI Requests", true),
    scales: {
      x: {
        stacked: true,
        grid: { color: "rgba(156, 163, 175, 0.05)" },
        ticks: { color: "#9ca3af", font: { size: 10 } },
      },
      y: {
        stacked: true,
        grid: { color: "rgba(156, 163, 175, 0.05)" },
        ticks: { color: "#9ca3af", font: { size: 10 } },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          color: "#9ca3af",
          font: { size: 10 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dateIndex = context.dataIndex;
            const dataset = context.dataset;
            const value = context.parsed.y;
            if (value === 0) return null;
            const provider = dataset.provider;
            const model = dataset.model;
            const req = findRequestData(dateIndex, provider, model);
            if (req) {
              return [
                `${provider || "Unknown"} (${model || "Unknown"}):`,
                `  Requests: ${value}`,
                `  Input Tokens: ${(req.input_token || 0).toLocaleString()}`,
                `  Output Tokens: ${(req.output_token || 0).toLocaleString()}`,
                `  Total Tokens: ${(req.total_token || 0).toLocaleString()}`,
              ];
            }
            return `${provider || "Unknown"} (${model || "Unknown"}): ${value} requests`;
          },
        },
      },
    },
  };

  // 2. Token Usage Chart data
  const tokenUsageData = {
    labels,
    datasets: [
      {
        label: "Input Tokens",
        data: chartData.map((d) =>
          (d.ai_requests || []).reduce(
            (acc, curr) => acc + (curr.input_token || 0),
            0,
          ),
        ),
        borderColor: "#3b82f6", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.1,
        fill: false,
      },
      {
        label: "Output Tokens",
        data: chartData.map((d) =>
          (d.ai_requests || []).reduce(
            (acc, curr) => acc + (curr.output_token || 0),
            0,
          ),
        ),
        borderColor: "#f59e0b", // amber-500
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.1,
        fill: false,
      },
      {
        label: "Total Tokens",
        data: chartData.map((d) =>
          (d.ai_requests || []).reduce(
            (acc, curr) => acc + (curr.total_token || 0),
            0,
          ),
        ),
        borderColor: "#10b981", // emerald-500
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 4,
        tension: 0.1,
        fill: false,
      },
    ],
  };

  // 3. General Requests Chart data
  const generalRequestsData = {
    labels,
    datasets: [
      {
        label: "Logins",
        data: chartData.map((d) => d.login_quantity || 0),
        borderColor: "#10b981", // green
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.15,
      },
      {
        label: "Emails",
        data: chartData.map((d) => d.mail_sent_quantity || 0),
        borderColor: "#8b5cf6", // purple
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.15,
      },
      // Show News API line if NOT user-chart or guest-chart
      ...(activeTab !== "user-chart" && activeTab !== "guest-chart"
        ? [
            {
              label: "News API",
              data: chartData.map((d) => d.news_api_quantity || 0),
              borderColor: "#f97316", // orange
              backgroundColor: "transparent",
              borderWidth: 2,
              tension: 0.15,
            },
          ]
        : []),
      {
        label: "Cloudinary",
        data: chartData.map((d) => d.cloudinary_upload_quantity || 0),
        borderColor: "#ef4444", // red
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.15,
      },
    ],
  };

  // 4. Dictionary Requests Chart data
  const dictionaryRequestsData = {
    labels,
    datasets: [
      {
        label: "Free Dictionary API",
        data: chartData.map(
          (d) => d.dictionary_request?.dictionary_api_quantity || 0,
        ),
        backgroundColor: "#3b82f6", // blue-500
        borderRadius: 4,
      },
      {
        label: "Todaii Dictionary API",
        data: chartData.map(
          (d) => d.dictionary_request?.todaii_dict_quantity || 0,
        ),
        backgroundColor: "#6b7280", // gray-500
        borderRadius: 4,
      },
    ],
  };

  // 5. YouTube Requests Chart data (Dual Axis)
  const youtubeRequestsData = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Requests Count",
        data: chartData.map((d) => d.youtube_request?.quantity || 0),
        backgroundColor: "#ef4444", // red
        yAxisID: "y",
        borderRadius: 4,
      },
      {
        type: "line",
        label: "Quota Units",
        data: chartData.map((d) => d.youtube_request?.quota || 0),
        borderColor: "#1f2937", // dark gray
        borderWidth: 2,
        tension: 0.1,
        yAxisID: "y1",
        fill: false,
      },
    ],
  };

  const getDualAxisOptions = (yTitle, y1Title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
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
        type: "linear",
        display: true,
        position: "left",
        grid: { color: "rgba(156, 163, 175, 0.05)" },
        ticks: { color: "#9ca3af", font: { size: 10 } },
        title: {
          display: true,
          text: yTitle,
          color: "#9ca3af",
          font: { size: 10, weight: "bold" },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
        ticks: { color: "#9ca3af", font: { size: 10 } },
        title: {
          display: true,
          text: y1Title,
          color: "#9ca3af",
          font: { size: 10, weight: "bold" },
        },
      },
    },
  });

  // 6. Google Translate Requests Chart data (Dual Axis)
  const googleTranslateData = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Requests Count",
        data: chartData.map((d) => d.gg_translate_request?.quantity || 0),
        backgroundColor: "#2563eb", // blue-600
        yAxisID: "y",
        borderRadius: 4,
      },
      {
        type: "line",
        label: "Characters Translated",
        data: chartData.map((d) => d.gg_translate_request?.char_quantity || 0),
        borderColor: "#10b981", // emerald-500
        borderWidth: 2,
        tension: 0.1,
        yAxisID: "y1",
        fill: false,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. AI Requests Chart */}
      <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[350px]">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 block">
          AI Requests (by Provider/Model)
        </h3>
        <div className="flex-1 relative">
          <Bar
            data={{ labels, datasets: aiRequestsDatasets }}
            options={aiRequestsOptions}
          />
        </div>
      </div>

      {/* 2. Token Usage Chart */}
      <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[350px]">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 block">
          Token Usage
        </h3>
        <div className="flex-1 relative">
          <Line
            data={tokenUsageData}
            options={getCommonOptions("Token Usage")}
          />
        </div>
      </div>

      {/* 3. General Requests Chart */}
      <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[350px]">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 block">
          General Requests
        </h3>
        <div className="flex-1 relative">
          <Line
            data={generalRequestsData}
            options={getCommonOptions("General Requests")}
          />
        </div>
      </div>

      {/* 4. Dictionary Requests Chart */}
      <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[350px]">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 block">
          Dictionary Requests
        </h3>
        <div className="flex-1 relative">
          <Bar
            data={dictionaryRequestsData}
            options={getCommonOptions("Dictionary Requests")}
          />
        </div>
      </div>

      {/* 5. YouTube Requests Chart */}
      {activeTab !== "user-chart" && activeTab !== "guest-chart" && (
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[350px]">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 block">
            YouTube Requests (Dual Axis)
          </h3>
          <div className="flex-1 relative">
            <Bar
              data={youtubeRequestsData}
              options={getDualAxisOptions("Requests", "Quota Units")}
            />
          </div>
        </div>
      )}

      {/* 6. Google Translate Requests Chart */}
      {activeTab !== "my-chart" && activeTab !== "admin-chart" && (
        <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col h-[350px]">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 block">
            Google Translate Requests (Dual Axis)
          </h3>
          <div className="flex-1 relative">
            <Bar
              data={googleTranslateData}
              options={getDualAxisOptions("Requests", "Characters")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;

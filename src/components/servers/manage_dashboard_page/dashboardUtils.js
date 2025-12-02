export const EVENT_COLORS = {
  DICTIONARY_API: "rgba(96, 165, 250, 0.8)",
  AI_REQUEST: "rgba(168, 85, 247, 0.8)",
  NEWSAPI_REQUEST: "rgba(251, 191, 36, 0.8)",
  YOUTUBE_SEARCH: "rgba(220, 38, 38, 0.8)",
  CLOUDINARY_UPLOAD: "rgba(251, 146, 60, 0.8)",
  USER_LOGIN: "rgba(34, 197, 94, 0.8)",
  ADMIN_LOGIN: "rgba(30, 64, 175, 0.8)",
  ADMIN_ACTION: "rgba(109, 40, 217, 0.8)",
  MAIL_SEND: "rgba(107, 114, 128, 0.8)",
};

export const getUniqueDates = (logTrends) => {
  if (!logTrends) return [];

  const allDates = new Set();

  Object.values(logTrends).forEach((arr) =>
    arr.forEach((item) => allDates.add(item.date))
  );

  return Array.from(allDates).sort();
};

// Process Data cho Token Chart (Stacked Bar)
// dashboardUtils.js
export const getTokenChartData = (ai_token_trends) => {
  if (!ai_token_trends) return null;

  const dates = Object.keys(ai_token_trends).sort();

  const inputData = dates.map((d) => ai_token_trends[d]?.input_token || 0);
  const outputData = dates.map((d) => ai_token_trends[d]?.output_token || 0);

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
};

// Process Data cho Distribution Chart (Doughnut)
export const getEventDistributionData = (
  log_summary,
  exclude = ["YOUTUBE_SEARCH"]
) => {
  if (!log_summary) return null;

  const keys = Object.keys(log_summary).filter((k) => !exclude.includes(k));

  return {
    labels: keys.map((k) => k.replace(/_/g, " ")),
    datasets: [
      {
        data: keys.map((k) => log_summary[k]),
        backgroundColor: keys.map((k) => EVENT_COLORS[k] || "#999"),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };
};

// Process Data cho từng Event Chart riêng biệt
export const getEventChartsData = (log_trends, log_summary) => {
  if (!log_trends) return [];

  const dates = getUniqueDates(log_trends);

  return Object.keys(log_trends).map((key) => {
    const quantityData = dates.map(
      (date) => log_trends[key].find((d) => d.date === date)?.quantity || 0
    );

    const total = log_summary?.[key] || 0;
    const color = EVENT_COLORS[key] || "#999";

    const isLineChart = [
      "YOUTUBE_SEARCH",
      "NEWSAPI_REQUEST",
      "DICTIONARY_API",
      "AI_REQUEST",
    ].includes(key);

    return {
      key,
      title: key.replace(/_/g, " "),
      total,
      isLineChart,
      chartData: {
        labels: dates,
        datasets: [
          {
            label: `${key === "YOUTUBE_SEARCH" ? "Units" : "Quantity"}`,
            data: quantityData,
            borderColor: color,
            backgroundColor: isLineChart ? color.replace("0.8", "0.1") : color,
            borderWidth: isLineChart ? 2 : 0,
            pointRadius: isLineChart ? 3 : 0,
            tension: 0.4,
            fill: isLineChart,
          },
        ],
      },
    };
  });
};

// Config chung cho các chart nhỏ
export const miniChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    x: { display: false },
    y: {
      display: true,
      ticks: { maxTicksLimit: 3 },
      grid: { display: false },
    },
  },
  layout: { padding: 0 },
};

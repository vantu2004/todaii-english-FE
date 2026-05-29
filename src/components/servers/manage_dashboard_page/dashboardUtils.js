export const EVENT_COLORS = {
  LOGIN_REQUEST: "rgba(34, 197, 94, 0.8)",
  AI_REQUEST: "rgba(168, 85, 247, 0.8)",
  MAIL_SEND: "rgba(107, 114, 128, 0.8)",
  DICTIONARY_API_REQUEST: "rgba(96, 165, 250, 0.8)",
  TODAII_DICT_REQUEST: "rgba(59, 130, 246, 0.8)",
  NEWS_API_REQUEST: "rgba(251, 191, 36, 0.8)",
  YOUTUBE_SEARCH: "rgba(220, 38, 38, 0.8)",
  CLOUDINARY_UPLOAD: "rgba(251, 146, 60, 0.8)",
  GOOGLE_TRANSLATE_REQUEST: "rgba(236, 72, 153, 0.8)",
};

export const getTokenChartData = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) return null;

  const sortedData = [...rawData].sort((a, b) => a.date.localeCompare(b.date));
  const dates = sortedData.map((d) => d.date);

  const inputData = sortedData.map((d) =>
    (d.ai_requests || []).reduce(
      (sum, item) => sum + (item.input_token || 0),
      0,
    ),
  );
  const outputData = sortedData.map((d) =>
    (d.ai_requests || []).reduce(
      (sum, item) => sum + (item.output_token || 0),
      0,
    ),
  );

  return {
    labels: dates,
    datasets: [
      {
        label: "Input Tokens",
        data: inputData,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        stack: "Stack 0",
      },
      {
        label: "Output Tokens",
        data: outputData,
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        stack: "Stack 0",
      },
    ],
  };
};

export const getEventDistributionData = (
  rawData,
  exclude = ["YOUTUBE_SEARCH"],
) => {
  if (!rawData || !Array.isArray(rawData)) return null;

  const totals = {
    LOGIN_REQUEST: 0,
    AI_REQUEST: 0,
    MAIL_SEND: 0,
    DICTIONARY_API_REQUEST: 0,
    TODAII_DICT_REQUEST: 0,
    NEWS_API_REQUEST: 0,
    YOUTUBE_SEARCH: 0,
    CLOUDINARY_UPLOAD: 0,
    GOOGLE_TRANSLATE_REQUEST: 0,
  };

  rawData.forEach((day) => {
    totals.LOGIN_REQUEST += day.login_quantity || 0;
    totals.AI_REQUEST += (day.ai_requests || []).reduce(
      (sum, ai) => sum + (ai.quantity || 0),
      0,
    );
    totals.MAIL_SEND += day.mail_sent_quantity || 0;
    totals.DICTIONARY_API_REQUEST +=
      day.dictionary_request?.dictionary_api_quantity || 0;
    totals.TODAII_DICT_REQUEST +=
      day.dictionary_request?.todaii_dict_quantity || 0;
    totals.NEWS_API_REQUEST += day.news_api_quantity || 0;
    totals.YOUTUBE_SEARCH += day.youtube_request?.quantity || 0;
    totals.CLOUDINARY_UPLOAD += day.cloudinary_upload_quantity || 0;
    totals.GOOGLE_TRANSLATE_REQUEST += day.gg_translate_request?.quantity || 0;
  });

  const keys = Object.keys(totals).filter(
    (key) => !exclude.includes(key) && totals[key] > 0,
  );

  if (keys.length === 0) return null;

  return {
    labels: keys.map((k) => k.replace(/_/g, " ")),
    datasets: [
      {
        data: keys.map((k) => totals[k]),
        backgroundColor: keys.map((k) => EVENT_COLORS[k] || "#e5e5e5"),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };
};

export const getEventChartsData = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) return [];

  const sortedData = [...rawData].sort((a, b) => a.date.localeCompare(b.date));
  const dates = sortedData.map((d) => d.date);

  const metricsConfig = [
    {
      key: "LOGIN_REQUEST",
      title: "Login Requests",
      getValue: (d) => d.login_quantity || 0,
      isLine: false,
    },
    {
      key: "AI_REQUEST",
      title: "AI Requests",
      getValue: (d) =>
        (d.ai_requests || []).reduce((sum, ai) => sum + (ai.quantity || 0), 0),
      isLine: true,
    },
    {
      key: "DICTIONARY_API_REQUEST",
      title: "Dictionary API",
      getValue: (d) => d.dictionary_request?.dictionary_api_quantity || 0,
      isLine: true,
    },
    {
      key: "TODAII_DICT_REQUEST",
      title: "Todaii Dict",
      getValue: (d) => d.dictionary_request?.todaii_dict_quantity || 0,
      isLine: true,
    },
    {
      key: "NEWS_API_REQUEST",
      title: "News API",
      getValue: (d) => d.news_api_quantity || 0,
      isLine: false,
    },
    {
      key: "YOUTUBE_SEARCH",
      title: "YouTube Search",
      getValue: (d) => d.youtube_request?.quantity || 0,
      isLine: true,
    },
    {
      key: "CLOUDINARY_UPLOAD",
      title: "Cloudinary Uploads",
      getValue: (d) => d.cloudinary_upload_quantity || 0,
      isLine: false,
    },
    {
      key: "GOOGLE_TRANSLATE_REQUEST",
      title: "Google Translate",
      getValue: (d) => d.gg_translate_request?.quantity || 0,
      isLine: false,
    },
    {
      key: "MAIL_SEND",
      title: "Emails Sent",
      getValue: (d) => d.mail_sent_quantity || 0,
      isLine: false,
    },
  ];

  return metricsConfig.map((metric) => {
    const quantityData = sortedData.map((d) => metric.getValue(d));
    const total = quantityData.reduce((sum, val) => sum + val, 0);
    const color = EVENT_COLORS[metric.key] || "#999";

    return {
      key: metric.key,
      title: metric.title,
      total,
      isLineChart: metric.isLine,
      chartData: {
        labels: dates,
        datasets: [
          {
            label: "Quantity",
            data: quantityData,
            borderColor: color,
            backgroundColor: metric.isLine
              ? color.replace("0.8", "0.1")
              : color,
            borderWidth: metric.isLine ? 2 : 0,
            pointRadius: metric.isLine ? 2 : 0,
            tension: 0.4,
            fill: metric.isLine,
          },
        ],
      },
    };
  });
};

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

import { useMemo } from "react";
import ChartContainer from "./ChartContainer";
import { Users } from "lucide-react";
import { Doughnut, Bar } from "react-chartjs-2";

const EVENT_COLORS = {
  DICTIONARY_API: "rgba(59, 130, 246, 0.8)",
  AI_REQUEST: "rgba(139, 92, 246, 0.8)",
  NEWSAPI_REQUEST: "rgba(236, 72, 153, 0.8)",
  YOUTUBE_SEARCH: "rgba(239, 68, 68, 0.8)",
  CLOUDINARY_UPLOAD: "rgba(245, 158, 11, 0.8)",
  USER_LOGIN: "rgba(16, 185, 129, 0.8)",
  ADMIN_ACTION: "rgba(99, 102, 241, 0.8)",
  MAIL_SEND: "rgba(107, 114, 128, 0.8)",
};

const getUniqueDates = (logTrends) => {
  if (!logTrends) return [];
  const allDates = new Set();
  Object.values(logTrends).forEach((arr) =>
    arr.forEach((item) => allDates.add(item.date))
  );
  return Array.from(allDates).sort();
};

const UserSection = ({ data }) => {
  const activityChartData = useMemo(() => {
    if (!data?.log_trends) return null;
    const labels = getUniqueDates(data.log_trends);
    const keysOfInterest = ["USER_LOGIN", "AI_REQUEST", "CLOUDINARY_UPLOAD"];
    const datasets = keysOfInterest.map((key) => ({
      label: key.replace("_", " "),
      data: labels.map(
        (date) =>
          data.log_trends[key]?.find((d) => d.date === date)?.quantity || 0
      ),
      backgroundColor: EVENT_COLORS[key] || "#999",
      borderColor: EVENT_COLORS[key] || "#999",
      type: key === "USER_LOGIN" ? "line" : "bar",
      borderWidth: 2,
      fill: key === "USER_LOGIN",
    }));
    return { labels, datasets };
  }, [data]);

  const distributionData = useMemo(() => {
    if (!data?.log_summary) return null;
    const keys = Object.keys(data.log_summary);
    return {
      labels: keys.map((k) => k.replace("_", " ")),
      datasets: [
        {
          data: keys.map((k) => data.log_summary[k]),
          backgroundColor: keys.map((k) => EVENT_COLORS[k] || "#ccc"),
          borderWidth: 0,
        },
      ],
    };
  }, [data]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <Users size={20} /> User Activities
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartContainer
            title="Activity Distribution"
            subtitle="Action breakdown"
          >
            {distributionData ? (
              <Doughnut
                data={distributionData}
                options={{
                  maintainAspectRatio: false,
                  cutout: "70%",
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { boxWidth: 12, padding: 20 },
                    },
                  },
                }}
              />
            ) : (
              <p>No Data</p>
            )}
          </ChartContainer>
        </div>
        <div className="lg:col-span-2">
          <ChartContainer
            title="User Engagement Trends"
            subtitle="Logins vs Feature Usage"
          >
            {activityChartData ? (
              <Bar
                data={activityChartData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  interaction: { mode: "index", intersect: false },
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

export default UserSection;

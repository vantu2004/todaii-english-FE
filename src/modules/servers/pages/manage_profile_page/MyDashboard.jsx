import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";
import { getMyChart } from "@/api/servers/dashboardApi";
import { formatDate } from "@/utils/FormatDate";
import { logError } from "@/utils/LogError";
import DateRangePicker from "@/components/servers/dashboard/DateRangePicker";
import DashboardCharts from "@/components/servers/dashboard/DashboardCharts";

const getRangeForDays = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
};

const MyDashboard = () => {
  const { setHeader } = useHeaderContext();

  // Date picker states
  const [preset, setPreset] = useState("7");
  const [dates, setDates] = useState(() => getRangeForDays(7));

  // Chart data states
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Setup header
  useEffect(() => {
    setHeader({
      title: "My Dashboard",
      breadcrumb: [{ label: "Home", to: "/server" }, { label: "My Dashboard" }],
    });
  }, []);

  // Fetch charts data
  const fetchMyChartData = async () => {
    try {
      setLoading(true);
      const data = await getMyChart(dates.startDate, dates.endDate);
      setChartData(data);
    } catch (error) {
      logError(error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyChartData();
  }, [dates]);

  const handleRangeChange = (start, end) => {
    setDates({ startDate: start, endDate: end });
  };

  return (
    <div className="flex flex-col space-y-6 min-h-full pb-10">
      {/* Date Filter & Controls */}
      <DateRangePicker
        startDate={dates.startDate}
        endDate={dates.endDate}
        onRangeChange={handleRangeChange}
        preset={preset}
        setPreset={setPreset}
        onRefresh={fetchMyChartData}
        loading={loading}
      />

      {/* Render Charts */}
      <div className="flex-1">
        <DashboardCharts
          chartData={chartData}
          loading={loading}
          activeTab="my-chart"
        />
      </div>
    </div>
  );
};

export default MyDashboard;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";
import { getAdminChartById } from "@/api/servers/dashboardApi";
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

const AdminDashboard = () => {
  const { id } = useParams();
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
      title: `Admin Dashboard`,
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Admins", to: "/server/admin" },
        { label: `Admin ID: ${id}` },
      ],
    });
  }, [id]);

  // Fetch charts data
  const fetchAdminChartData = async () => {
    try {
      setLoading(true);
      const data = await getAdminChartById(id, dates.startDate, dates.endDate);
      setChartData(data);
    } catch (error) {
      logError(error);
      toast.error(`Failed to fetch dashboard data for Admin ID: ${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminChartData();
  }, [id, dates]);

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
        onRefresh={fetchAdminChartData}
        loading={loading}
      />

      {/* Render Charts */}
      <div className="flex-1">
        <DashboardCharts
          chartData={chartData}
          loading={loading}
          activeTab="admin-chart"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

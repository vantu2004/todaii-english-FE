import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  RefreshCcw,
} from "lucide-react";
import {
  getSummary,
  getAdminDashboard,
  getUserChart,
} from "../../../api/servers/dashboardApi";
import AdminSection from "../../../components/servers/manage_dashboard_page/AdminSection";
import UserSection from "../../../components/servers/manage_dashboard_page/UserSection";
import SummaryStats from "../../../components/servers/manage_dashboard_page/SummaryStats";
import { logError } from "../../../utils/LogError";
import { useHeaderContext } from "../../../hooks/servers/useHeaderContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { setHeader } = useHeaderContext();

  const [summary, setSummary] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, adminRes, userRes] = await Promise.all([
        getSummary(),
        getAdminDashboard(dateRange.startDate, dateRange.endDate),
        getUserChart(dateRange.startDate, dateRange.endDate),
      ]);
      setSummary(sumRes);
      setAdminData(adminRes);
      setUserData(userRes);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHeader({
      title: "Dashboard",
      breadcrumb: [
        { label: `Continuous Updates - ${new Date().toLocaleDateString()}` },
      ],
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return (
    <>
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="text-blue-500" /> Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Analytics for Dictionary & AI Integrations
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center px-3 border border-gray-200 dark:border-gray-700 rounded-md">
            <CalendarIcon size={16} className="text-gray-400 mr-2" />
            <input
              type="date"
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 py-2 outline-none"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
          </div>
          <span className="self-center text-gray-400">-</span>
          <div className="flex items-center px-3 border border-gray-200 dark:border-gray-700 rounded-md">
            <input
              type="date"
              className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 py-2 outline-none"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </div>
          <button
            onClick={fetchData}
            className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            title="Refresh Data"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Content Sections */}
      {loading && !summary ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <SummaryStats data={summary} />
          <AdminSection data={adminData} />
          <UserSection data={userData} />
        </>
      )}

      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
        TODAII - Team • {new Date().toLocaleDateString()}
      </div>
    </>
  );
};

export default Dashboard;

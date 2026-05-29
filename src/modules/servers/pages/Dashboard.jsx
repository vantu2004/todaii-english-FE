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
  User,
  Users,
  UserCircle,
} from "lucide-react";
import {
  getSummary,
  getAdminDashboard,
  getUserChart,
  getGuestChart,
} from "@/api/servers/dashboardApi";
import AdminSection from "@/components/servers/manage_dashboard_page/AdminSection";
import ClientActivitySection from "@/components/servers/manage_dashboard_page/ClientActivitySection";
import SummaryStats from "@/components/servers/manage_dashboard_page/SummaryStats";
import { logError } from "@/utils/LogError";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";
import { formatDate } from "@/utils/FormatDate";
import { set } from "date-fns";

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
  Filler,
);

const Dashboard = () => {
  const { setHeader } = useHeaderContext();

  const [summary, setSummary] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [guestData, setGuestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientViewMode, setClientViewMode] = useState("user");

  const [dateRange, setDateRange] = useState({
    startDate: formatDate(new Date().setDate(new Date().getDate() - 7)),
    endDate: formatDate(new Date()),
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, adminRes, userRes, guestRes] = await Promise.all([
        getSummary(),
        getAdminDashboard(dateRange.startDate, dateRange.endDate),
        getUserChart(dateRange.startDate, dateRange.endDate),
        getGuestChart(dateRange.startDate, dateRange.endDate),
      ]);

      setSummary(sumRes);
      setAdminData(adminRes);
      setUserData(userRes);
      setGuestData(guestRes);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHeader({
      title: "Dashboard",
      breadcrumb: [{ label: `Continuous Updates - ${formatDate(new Date())}` }],
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
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="text-neutral-500 dark:text-neutral-400" />{" "}
            Dashboard Overview
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Real-time Insights for Todaii Ecosystem
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-neutral-900 p-1.5 rounded-lg ring-1 ring-neutral-200 dark:ring-neutral-800">
          <div className="flex items-center px-3 border border-neutral-200 dark:border-neutral-700 rounded-md">
            <CalendarIcon size={16} className="text-neutral-400 mr-2" />
            <input
              type="date"
              className="text-sm bg-transparent border-none focus:ring-0 text-neutral-900 dark:text-white py-2 outline-none"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
          </div>
          <span className="self-center text-neutral-400">-</span>
          <div className="flex items-center px-3 border border-neutral-200 dark:border-neutral-700 rounded-md">
            <input
              type="date"
              className="text-sm bg-transparent border-none focus:ring-0 text-neutral-900 dark:text-white py-2 outline-none"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </div>
          <button
            onClick={fetchData}
            className="p-2 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors"
            title="Refresh Data"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Content Sections */}
      {loading && !summary ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-900 dark:border-white"></div>
        </div>
      ) : (
        <>
          <SummaryStats data={summary} />
          <AdminSection data={adminData} />

          {/* (User / Guest Switcher) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Users size={20} /> Client Activities
              </h2>

              {/* Toggle Switch */}
              <div className="flex bg-neutral-100 dark:bg-neutral-800/50 p-1 rounded-lg ring-1 ring-neutral-200 dark:ring-neutral-800/50">
                <button
                  onClick={() => setClientViewMode("user")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    clientViewMode === "user"
                      ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                      : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                  }`}
                >
                  <UserCircle size={16} /> Registered Users
                </button>
                <button
                  onClick={() => setClientViewMode("guest")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    clientViewMode === "guest"
                      ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                      : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                  }`}
                >
                  <User size={16} /> Guests
                </button>
              </div>
            </div>

            {/* Render Section based on Selection */}
            {clientViewMode === "user" ? (
              <ClientActivitySection data={userData} type="User" />
            ) : (
              <ClientActivitySection data={guestData} type="Guest" />
            )}
          </div>
        </>
      )}

      <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500">
        TODAII - Team • {formatDate(new Date())}
      </div>
    </>
  );
};

export default Dashboard;

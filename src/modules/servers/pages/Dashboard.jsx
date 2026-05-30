import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";
import {
  getSummary,
  getMyChart,
  getAdminDashboard,
  getAdminChartById,
  getUserChart,
  getUserChartById,
  getGuestChart,
} from "@/api/servers/dashboardApi";
import { formatDate } from "@/utils/FormatDate";
import { logError } from "@/utils/LogError";
import SummaryCards from "@/components/servers/dashboard/SummaryCards";
import DateRangePicker from "@/components/servers/dashboard/DateRangePicker";
import DashboardCharts from "@/components/servers/dashboard/DashboardCharts";
import { Search, X } from "lucide-react";

const getRangeForDays = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
};

const Dashboard = () => {
  const { setHeader } = useHeaderContext();

  // Summary Metrics State
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Date Range and Preset State
  const [preset, setPreset] = useState("7");
  const [dates, setDates] = useState(() => getRangeForDays(7));

  // Chart Data State
  const [activeTab, setActiveTab] = useState("my-chart"); // my-chart, admin-chart, user-chart, guest-chart
  const [searchId, setSearchId] = useState("");
  const [inputId, setInputId] = useState("");
  const [chartData, setChartData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Setup header
  useEffect(() => {
    setHeader({
      title: "Dashboard",
      breadcrumb: [{ label: "Home", to: "/server" }, { label: "Dashboard" }],
    });
  }, []);

  // Fetch summary data once on load
  const fetchSummary = async () => {
    try {
      setSummaryLoading(true);
      const data = await getSummary();
      setSummaryData(data);
    } catch (error) {
      logError(error);
      toast.error("Failed to fetch summary statistics");
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // Fetch chart data when dates, tab, or searchId changes
  const fetchChartData = async () => {
    try {
      setChartsLoading(true);
      let data = [];
      if (activeTab === "my-chart") {
        data = await getMyChart(dates.startDate, dates.endDate);
      } else if (activeTab === "admin-chart") {
        if (searchId.trim()) {
          data = await getAdminChartById(
            searchId.trim(),
            dates.startDate,
            dates.endDate,
          );
        } else {
          data = await getAdminDashboard(dates.startDate, dates.endDate);
        }
      } else if (activeTab === "user-chart") {
        if (searchId.trim()) {
          data = await getUserChartById(
            searchId.trim(),
            dates.startDate,
            dates.endDate,
          );
        } else {
          data = await getUserChart(dates.startDate, dates.endDate);
        }
      } else if (activeTab === "guest-chart") {
        data = await getGuestChart(dates.startDate, dates.endDate);
      }
      setChartData(data);
    } catch (error) {
      logError(error);
      toast.error("Failed to fetch chart details");
    } finally {
      setChartsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [dates, activeTab, searchId]);

  const handleRangeChange = (start, end) => {
    setDates({ startDate: start, endDate: end });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchId("");
    setInputId("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchId(inputId);
  };

  const handleClearSearch = () => {
    setSearchId("");
    setInputId("");
  };

  return (
    <div className="flex flex-col space-y-6 min-h-full pb-10">
      {/* 1. Summary Cards Section */}
      <SummaryCards summaryData={summaryData} loading={summaryLoading} />

      {/* 2. Controls Row */}
      <div className="flex flex-col space-y-4">
        {/* Date Range Picker */}
        <DateRangePicker
          startDate={dates.startDate}
          endDate={dates.endDate}
          onRangeChange={handleRangeChange}
          preset={preset}
          setPreset={setPreset}
          onRefresh={fetchChartData}
          loading={chartsLoading}
        />

        {/* Actor Tabs & Optional ID Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex bg-gray-100 dark:bg-gray-850 p-1 rounded-lg self-start">
            <button
              onClick={() => handleTabChange("my-chart")}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === "my-chart"
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              My Chart
            </button>
            <button
              onClick={() => handleTabChange("admin-chart")}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === "admin-chart"
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleTabChange("user-chart")}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === "user-chart"
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              User
            </button>
            <button
              onClick={() => handleTabChange("guest-chart")}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === "guest-chart"
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Guest
            </button>
          </div>

          {/* Search ID Form (for Admin and User tabs) */}
          {(activeTab === "admin-chart" || activeTab === "user-chart") && (
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Enter ${activeTab === "admin-chart" ? "Admin" : "User"} ID`}
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  className="pl-8 pr-8 py-2 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 w-52"
                />
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                {inputId && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 dark:hover:text-gray-250"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-3 py-2 text-xs font-medium bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors"
              >
                Search
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 3. Charts Area */}
      <div className="flex-1">
        <DashboardCharts
          chartData={chartData}
          loading={chartsLoading}
          activeTab={activeTab}
        />
      </div>
    </div>
  );
};

export default Dashboard;

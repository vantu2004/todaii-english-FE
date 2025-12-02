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
import { Calendar as CalendarIcon, RefreshCcw } from "lucide-react";
import AdminSection from "../../../../components/servers/manage_dashboard_page/AdminSection";
import { logError } from "../../../../utils/LogError";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";
import { formatDate } from "../../../../utils/FormatDate";
import { getAdminChartById } from "../../../../api/servers/dashboardApi";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

const AdminDashboard = () => {
  const { setHeader } = useHeaderContext();

  const { id } = useParams();

  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: formatDate(new Date().setDate(new Date().getDate() - 30)),
    endDate: formatDate(new Date()),
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const myRes = await getAdminChartById(
        id,
        dateRange.startDate,
        dateRange.endDate
      );

      setAdminData(myRes);
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHeader({
      title: "Manange Users",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage Admins", to: "/server/admin" },
        { label: "Admin Dashboard" },
      ],
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  return (
    <>
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-3 sm:mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back to previous page</span>
        </button>

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
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <AdminSection data={adminData} />
        </>
      )}
    </>
  );
};

export default AdminDashboard;

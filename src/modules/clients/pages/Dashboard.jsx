import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, BookOpen, LogIn, Languages, BarChart3 } from "lucide-react";
import { getMyChart } from "@/api/clients/dashboardApi";
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

const Dashboard = () => {
  // Date picker states
  const [preset, setPreset] = useState("7");
  const [dates, setDates] = useState(() => getRangeForDays(7));

  // Chart data states
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch charts data
  const fetchMyChartData = async () => {
    try {
      setLoading(true);
      const data = await getMyChart(dates.startDate, dates.endDate);
      setChartData(data || []);
    } catch (error) {
      logError(error);
      toast.error("Không thể lấy dữ liệu thống kê hoạt động");
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

  // Calculate summary metrics from chartData for the chosen period
  const totalAiRequests = chartData.reduce((acc, day) => {
    const dailyTotal = (day.ai_requests || []).reduce(
      (sum, req) => sum + (req.quantity || 0),
      0,
    );
    return acc + dailyTotal;
  }, 0);

  const totalTokens = chartData.reduce((acc, day) => {
    const dailyTotal = (day.ai_requests || []).reduce(
      (sum, req) => sum + (req.total_token || 0),
      0,
    );
    return acc + dailyTotal;
  }, 0);

  const totalDictQueries = chartData.reduce((acc, day) => {
    const apiQty = day.dictionary_request?.dictionary_api_quantity || 0;
    const localQty = day.dictionary_request?.todaii_dict_quantity || 0;
    return acc + apiQty + localQty;
  }, 0);

  const totalDictLocal = chartData.reduce(
    (acc, day) => acc + (day.dictionary_request?.todaii_dict_quantity || 0),
    0,
  );
  const totalDictApi = chartData.reduce(
    (acc, day) => acc + (day.dictionary_request?.dictionary_api_quantity || 0),
    0,
  );

  const totalLogins = chartData.reduce(
    (acc, day) => acc + (day.login_quantity || 0),
    0,
  );

  const totalGgTranslations = chartData.reduce(
    (acc, day) => acc + (day.gg_translate_request?.quantity || 0),
    0,
  );

  const totalCharsTranslated = chartData.reduce(
    (acc, day) => acc + (day.gg_translate_request?.char_quantity || 0),
    0,
  );

  const totalEmails = chartData.reduce(
    (acc, day) => acc + (day.mail_sent_quantity || 0),
    0,
  );

  const totalUploads = chartData.reduce(
    (acc, day) => acc + (day.cloudinary_upload_quantity || 0),
    0,
  );

  return (
    <AnimatePresence>
      <motion.div
        key="client-dashboard"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-surface-primary dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-light text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="text-brand-500 w-8 h-8" />
                Thống kê hoạt động
              </h1>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400 text-sm">
                Theo dõi tiến trình học tập và lịch sử tra cứu của bạn
              </p>
            </div>
          </div>

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

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Card 1: AI Assistant */}
            <div className="bg-white dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 p-5 rounded-2xl flex flex-col justify-between transition-all hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-xl">
                  <Cpu size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    Trí tuệ nhân tạo (AI)
                  </p>
                  <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                    {loading ? "..." : totalAiRequests.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-neutral-400">
                      lượt
                    </span>
                  </h3>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>Tổng số token:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {loading ? "..." : totalTokens.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Card 2: Dictionary */}
            <div className="bg-white dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 p-5 rounded-2xl flex flex-col justify-between transition-all hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-xl">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    Tra cứu từ điển
                  </p>
                  <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                    {loading ? "..." : totalDictQueries.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-neutral-400">
                      lần
                    </span>
                  </h3>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>Todaii Dict / Free API:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {loading ? "..." : `${totalDictLocal} / ${totalDictApi}`}
                </span>
              </div>
            </div>

            {/* Card 3: Google Translation */}
            <div className="bg-white dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 p-5 rounded-2xl flex flex-col justify-between transition-all hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-xl">
                  <Languages size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    Google Dịch
                  </p>
                  <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                    {loading ? "..." : totalGgTranslations.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-neutral-400">
                      lượt
                    </span>
                  </h3>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>Ký tự đã dịch:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {loading ? "..." : totalCharsTranslated.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Card 4: Account Activity */}
            <div className="bg-white dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 p-5 rounded-2xl flex flex-col justify-between transition-all hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-xl">
                  <LogIn size={20} />
                </div>
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    Tương tác hệ thống
                  </p>
                  <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                    {loading ? "..." : totalLogins.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-neutral-400">
                      lần
                    </span>
                  </h3>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2">
                <span className="truncate">Thư nhận / Tải ảnh:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
                  {loading ? "..." : `${totalEmails} / ${totalUploads}`}
                </span>
              </div>
            </div>
          </div>

          {/* Render Charts */}
          <div className="mt-8">
            <DashboardCharts
              chartData={chartData}
              loading={loading}
              activeTab="user-chart"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;

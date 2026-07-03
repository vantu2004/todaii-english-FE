import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  BookOpen,
  LogIn,
  Languages,
  BarChart3,
  Flame,
  Award,
  Sparkles,
  TrendingUp,
  Calendar,
  AlertCircle,
  TrendingDown,
  MinusCircle,
  Loader,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { getMyChart } from "@/api/clients/dashboardApi";
import { getStreakInfo } from "@/api/clients/studyLogApi";
import {
  getWeaknessAnalysis,
  getScorePrediction,
} from "@/api/clients/analyticsApi";
import {
  getCurrentStudyPlan,
  getStudyPlanHistory,
} from "@/api/clients/studyPlanApi";
import UserLearningProfileWidget from "@/components/clients/UserLearningProfileWidget";
import { formatDate } from "@/utils/FormatDate";
import { logError } from "@/utils/LogError";
import DateRangePicker from "@/components/servers/dashboard/DateRangePicker";
import DashboardCharts from "@/components/servers/dashboard/DashboardCharts";

// Register Radial scale for Radar chart
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

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
  const [activeTab, setActiveTab] = useState("coach"); // "coach" | "analytics" | "activity"

  // Date picker states (for activity stats)
  const [preset, setPreset] = useState("7");
  const [dates, setDates] = useState(() => getRangeForDays(7));

  // Loading states
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingLearning, setLoadingLearning] = useState(true);

  // States
  const [chartData, setChartData] = useState([]);
  const [streakData, setStreakData] = useState(null);
  const [weaknessData, setWeaknessData] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch charts data
  const fetchMyChartData = async () => {
    try {
      setLoadingActivity(true);
      const data = await getMyChart(dates.startDate, dates.endDate);
      setChartData(data || []);
    } catch (error) {
      logError(error);
      toast.error("Failed to fetch activity statistics");
    } finally {
      setLoadingActivity(false);
    }
  };

  // Fetch advanced learning data
  // Fetch advanced learning data
  const fetchLearningData = async () => {
    try {
      setLoadingLearning(true);
      const [streak, weakness, score, plan, history] = await Promise.all([
        getStreakInfo(),
        getWeaknessAnalysis(),
        getScorePrediction(),
        getCurrentStudyPlan(),
        getStudyPlanHistory(),
      ]);
      setStreakData(streak);
      setWeaknessData(weakness || []);
      setScoreData(score);
      setCurrentPlan(plan);
      setSelectedPlan(plan);
      setPlanHistory(history || []);
    } catch (error) {
      console.error("Error fetching advanced learning data:", error);
    } finally {
      setLoadingLearning(false);
    }
  };

  useEffect(() => {
    fetchLearningData();
  }, []);

  useEffect(() => {
    if (activeTab === "activity") {
      fetchMyChartData();
    }
  }, [dates, activeTab]);

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

  // Today study progress calculations
  const dailyLog = streakData?.daily_study_log || {};
  const todayStudyMins = dailyLog.total_study_minutes || 0;
  const goalMins = 30;
  const computedPercent = Math.min(
    100,
    Math.round((todayStudyMins / goalMins) * 100),
  );

  // Circular progress configuration (larger size: 144px viewBox)
  const circleRadius = 54;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * circleRadius; // ~339.3
  const strokeDashoffset =
    circumference - (computedPercent / 100) * circumference;

  // Radar weakness chart data
  const radarChartData = {
    labels: weaknessData.map((w) => `P${w.part}`),
    datasets: [
      {
        label: "Độ chính xác (%)",
        data: weaknessData.map((w) => w.accuracy),
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#3b82f6",
      },
    ],
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "rgba(156, 163, 175, 0.1)" },
        grid: { color: "rgba(156, 163, 175, 0.1)" },
        pointLabels: {
          color: "#9ca3af",
          font: { size: 10, family: "Inter" },
        },
        ticks: {
          color: "#9ca3af",
          backdropColor: "transparent",
          font: { size: 8 },
          stepSize: 20,
        },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="client-dashboard"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-surface-primary dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-light text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className="text-brand-500 w-8 h-8" />
                Lộ trình & Thống kê
              </h1>
              <p className="mt-2 text-neutral-500 dark:text-neutral-400 text-sm">
                Đánh giá năng lực của bạn qua hệ thống đề thi và AI Coach
              </p>
            </div>

            {/* Premium Tab Bar */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 self-start md:self-center">
              <button
                onClick={() => setActiveTab("coach")}
                className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 rounded-md ${activeTab === "coach"
                  ? "text-neutral-900 dark:text-white bg-white dark:bg-neutral-700 shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  }`}
              >
                AI Study Coach
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 rounded-md ${activeTab === "analytics"
                  ? "text-neutral-900 dark:text-white bg-white dark:bg-neutral-700 shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  }`}
              >
                Đánh giá TOEIC
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 rounded-md ${activeTab === "activity"
                  ? "text-neutral-900 dark:text-white bg-white dark:bg-neutral-700 shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  }`}
              >
                Tương tác hệ thống
              </button>
            </div>
          </div>

          {loadingLearning && activeTab !== "activity" ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <Loader className="w-8 h-8 text-neutral-400 dark:text-neutral-500 animate-spin mb-4" />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Đang tải dữ liệu học tập...
              </span>
            </div>
          ) : (
            <>
              {/* TAB 1: AI STUDY COACH */}
              {activeTab === "coach" && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left panel: Plan History */}
                  <div className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 h-fit">
                    <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Calendar size={14} />
                      Lộ trình trước đây
                    </h3>
                    <div className="space-y-2">
                      {planHistory.length === 0 ? (
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 italic py-2">
                          Chưa có lịch sử lộ trình
                        </p>
                      ) : (
                        planHistory.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-medium transition-all ${selectedPlan?.id === plan.id
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                              }`}
                          >
                            Tuần ngày{" "}
                            {new Date(plan.created_at).toLocaleDateString(
                              "vi-VN",
                            )}
                          </button>
                        ))
                      )}
                    </div>

                    {/* Target Goal Section */}
                    <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                      <UserLearningProfileWidget />
                    </div>
                  </div>

                  {/* Right panel: Plan Content */}
                  <div className="lg:col-span-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
                    {selectedPlan ? (
                      <article className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
                          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2 m-0">
                            <Sparkles size={18} className="text-brand-500" />
                            Lộ trình học AI Coach
                          </h2>
                          <span className="text-xs text-neutral-400 dark:text-neutral-500">
                            Khởi tạo:{" "}
                            {new Date(
                              selectedPlan.created_at,
                            ).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <ReactMarkdown>
                          {selectedPlan.content}
                        </ReactMarkdown>
                      </article>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Sparkles
                          size={48}
                          className="text-neutral-300 dark:text-neutral-700 mb-4"
                        />
                        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                          Chưa có lộ trình AI
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mt-2">
                          Hệ thống AI Coach sẽ phân tích kết quả học của bạn và
                          gửi lộ trình đầu tiên vào thứ Hai hàng tuần. Hãy duy
                          trì học tập đều đặn nhé!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ANALYTICS & SCORE PREDICTION */}
              {activeTab === "analytics" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Streak & Progress */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Circle Study Progress Widget */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg flex flex-col items-center text-center shadow-sm">
                      <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-6 self-start flex items-center gap-1.5">
                        <Flame size={14} className="text-orange-500" />
                        Đã học hôm nay
                      </h3>
                      <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 144 144"
                        >
                          <circle
                            className="text-neutral-100 dark:text-neutral-800"
                            strokeWidth={strokeWidth}
                            stroke="currentColor"
                            fill="transparent"
                            r={circleRadius}
                            cx={72}
                            cy={72}
                          />
                          <circle
                            className="text-brand-500 transition-all duration-500"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            style={{ strokeDashoffset }}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={circleRadius}
                            cx={72}
                            cy={72}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center leading-none">
                          <span className="text-3xl font-light text-neutral-900 dark:text-white">
                            {todayStudyMins}
                          </span>
                          <span className="text-[10px] text-neutral-400 uppercase font-medium mt-1">
                            phút
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 font-medium">
                        {computedPercent >= 100
                          ? "Đã hoàn thành mục tiêu ngày!"
                          : `Còn thiếu ${Math.max(0, goalMins - todayStudyMins)} phút để đạt mục tiêu.`}
                      </p>

                      <div className="w-full mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-left text-xs">
                        <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                          <span>Đề thi đã luyện:</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {dailyLog.tests_taken_count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                          <span>Bài báo đã đọc:</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {dailyLog.articles_read_count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                          <span>Video đã xem:</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {dailyLog.videos_watched_count || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                          <span>Bộ từ vựng đã học:</span>
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {dailyLog.vocab_decks_learned_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Streak Info Widget */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg shadow-sm">
                      <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Award size={14} />
                        Thành tích Streak
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-md text-center border border-neutral-200 dark:border-neutral-800">
                          <Flame
                            className="mx-auto text-orange-500 mb-1"
                            size={24}
                          />
                          <span className="text-2xl font-light text-neutral-900 dark:text-white">
                            {streakData?.current_streak || 0}
                          </span>
                          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium mt-1">
                            STREAK HIỆN TẠI
                          </p>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-md text-center border border-neutral-200 dark:border-neutral-800">
                          <Award
                            className="mx-auto text-yellow-500 mb-1"
                            size={24}
                          />
                          <span className="text-2xl font-light text-neutral-900 dark:text-white">
                            {streakData?.longest_streak || 0}
                          </span>
                          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium mt-1">
                            STREAK KỶ LỤC
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Radar Weakness Chart */}
                  <div className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg flex flex-col h-[380px] shadow-sm">
                    <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                      <AlertCircle size={14} />
                      Phân tích điểm yếu (Accuracy)
                    </h3>
                    <div className="flex-1 relative h-64">
                      {weaknessData.length > 0 ? (
                        <Radar
                          data={radarChartData}
                          options={radarChartOptions}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-neutral-400 dark:text-neutral-500 italic">
                          Chưa có dữ liệu kiểm tra
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Score Prediction */}
                  <div className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg flex flex-col justify-between shadow-sm">
                    <div>
                      <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-6 flex items-center gap-1.5">
                        <TrendingUp size={14} />
                        Dự đoán điểm thi thật
                      </h3>
                      {!scoreData || scoreData.total_tests_taken === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                          <Award
                            size={40}
                            className="text-neutral-300 dark:text-neutral-700 mb-3"
                          />
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[220px]">
                            Luyện tập ít nhất 1 đề thi full test để kích hoạt
                            tính năng dự đoán điểm và phân tích xu hướng học
                            tập.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-2 mb-4 justify-center py-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                            <span className="text-5xl font-light text-neutral-900 dark:text-white">
                              {scoreData.predicted_score || "N/A"}
                            </span>
                            <span className="text-sm font-semibold text-neutral-400 uppercase">
                              TOEIC
                            </span>
                          </div>
                          <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
                            <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-800/50">
                              <span>Điểm trung bình (3 đề gần nhất)</span>
                              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                {scoreData.avg_score || 0}
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-800/50">
                              <span>Điểm thưởng xu hướng (Trend bonus)</span>
                              <span className="font-semibold text-green-500">
                                +{scoreData.trend_bonus || 0}
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-800/50">
                              <span>Tổng số đề đã luyện</span>
                              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                {scoreData.total_tests_taken || 0} đề
                              </span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Xu hướng hiện tại</span>
                              <span className="flex items-center gap-1 font-semibold uppercase">
                                {scoreData.trend === "IMPROVING" && (
                                  <>
                                    <TrendingUp
                                      size={12}
                                      className="text-green-500"
                                    />
                                    <span className="text-green-500">
                                      Đang cải thiện
                                    </span>
                                  </>
                                )}
                                {scoreData.trend === "STABLE" && (
                                  <>
                                    <MinusCircle
                                      size={12}
                                      className="text-blue-500"
                                    />
                                    <span className="text-blue-500">
                                      Ổn định
                                    </span>
                                  </>
                                )}
                                {scoreData.trend === "DECLINING" && (
                                  <>
                                    <TrendingDown
                                      size={12}
                                      className="text-red-500"
                                    />
                                    <span className="text-red-500">
                                      Suy giảm
                                    </span>
                                  </>
                                )}
                                {(!scoreData.trend ||
                                  ![
                                    "IMPROVING",
                                    "STABLE",
                                    "DECLINING",
                                  ].includes(scoreData.trend)) && (
                                    <span className="text-neutral-400">
                                      Chưa có
                                    </span>
                                  )}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SYSTEM ACTIVITY STATS */}
              {activeTab === "activity" && (
                <>
                  {/* Date Filter & Controls */}
                  <DateRangePicker
                    startDate={dates.startDate}
                    endDate={dates.endDate}
                    onRangeChange={handleRangeChange}
                    preset={preset}
                    setPreset={setPreset}
                    onRefresh={fetchMyChartData}
                    loading={loadingActivity}
                  />

                  {/* Summary Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Card 1: AI Assistant */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-lg flex flex-col justify-between transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-md">
                          <Cpu size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                            Trí tuệ nhân tạo (AI)
                          </p>
                          <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                            {loadingActivity
                              ? "..."
                              : totalAiRequests.toLocaleString()}{" "}
                            <span className="text-xs font-normal text-neutral-400">
                              lượt
                            </span>
                          </h3>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                        <span>Tổng số token:</span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          {loadingActivity
                            ? "..."
                            : totalTokens.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Dictionary */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-lg flex flex-col justify-between transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-md">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                            Tra cứu từ điển
                          </p>
                          <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                            {loadingActivity
                              ? "..."
                              : totalDictQueries.toLocaleString()}{" "}
                            <span className="text-xs font-normal text-neutral-400">
                              lần
                            </span>
                          </h3>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                        <span>Todaii Dict / Free API:</span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          {loadingActivity
                            ? "..."
                            : `${totalDictLocal} / ${totalDictApi}`}
                        </span>
                      </div>
                    </div>

                    {/* Card 3: Google Translation */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-lg flex flex-col justify-between transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-md">
                          <Languages size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                            Google Dịch
                          </p>
                          <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                            {loadingActivity
                              ? "..."
                              : totalGgTranslations.toLocaleString()}{" "}
                            <span className="text-xs font-normal text-neutral-400">
                              lượt
                            </span>
                          </h3>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                        <span>Ký tự đã dịch:</span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          {loadingActivity
                            ? "..."
                            : totalCharsTranslated.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Card 4: Account Activity */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-lg flex flex-col justify-between transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-50 dark:bg-brand-950/30 text-brand-500 rounded-md">
                          <LogIn size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                            Tương tác hệ thống
                          </p>
                          <h3 className="text-xl font-light text-neutral-900 dark:text-white mt-1">
                            {loadingActivity
                              ? "..."
                              : totalLogins.toLocaleString()}{" "}
                            <span className="text-xs font-normal text-neutral-400">
                              lần
                            </span>
                          </h3>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2">
                        <span className="truncate">Thư nhận / Tải ảnh:</span>
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
                          {loadingActivity
                            ? "..."
                            : `${totalEmails} / ${totalUploads}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Render Charts */}
                  <div className="mt-8">
                    <DashboardCharts
                      chartData={chartData}
                      loading={loadingActivity}
                      activeTab="user-chart"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;

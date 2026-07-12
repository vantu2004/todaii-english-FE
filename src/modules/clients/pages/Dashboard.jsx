import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader } from "lucide-react";

import { getMyChart } from "@/api/clients/dashboardApi";
import { getStreakInfo, getAllDailyStudyLogs } from "@/api/clients/studyLogApi";
import {
  getWeaknessAnalysis,
  getScorePrediction,
} from "@/api/clients/analyticsApi";
import {
  getCurrentStudyPlan,
  getStudyPlanHistory,
  toggleStudyPlanTask,
} from "@/api/clients/studyPlanApi";
import { formatDate } from "@/utils/FormatDate";
import { logError } from "@/utils/LogError";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import { getUserLearningProfile } from "@/api/clients/userLearningProfileApi";
import { fetchLearnedWordIds } from "@/api/clients/userApi";

import LearningGoalModal from "@/components/clients/LearningGoalModal";
import StudyCalendar from "@/components/clients/dashboard/StudyCalendar";
import AiStudyCoachTab from "@/components/clients/dashboard/AiStudyCoachTab";
import ToeicAnalyticsTab from "@/components/clients/dashboard/ToeicAnalyticsTab";
import SystemActivityTab from "@/components/clients/dashboard/SystemActivityTab";

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
  const [activeTab, setActiveTab] = useState("coach"); // "coach" | "analytics" | "activity" | "calendar"

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
  const [selectedPlanTab, setSelectedPlanTab] = useState(null);

  // Learning Profile popup states
  const { isLoggedIn } = useClientAuthContext();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Calendar states
  const [studyLogs, setStudyLogs] = useState([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [totalLearnedWordsCount, setTotalLearnedWordsCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      const dismissed = localStorage.getItem(
        "todaii_dismiss_learning_profile_prompt",
      );
      if (dismissed !== "true") {
        const checkGoalSetup = async () => {
          try {
            const profile = await getUserLearningProfile();
            if (!profile || !profile.target_score || !profile.exam_date) {
              setShowProfileModal(true);
            }
          } catch (err) {
            setShowProfileModal(true);
          }
        };
        checkGoalSetup();
      }
    }
  }, [isLoggedIn]);

  const fetchStudyLogs = async () => {
    try {
      setLoadingCalendar(true);
      const data = await getAllDailyStudyLogs();
      setStudyLogs(data || []);
    } catch (error) {
      logError(error);
      toast.error("Không thể tải lịch sử học tập");
    } finally {
      setLoadingCalendar(false);
    }
  };

  useEffect(() => {
    if (activeTab === "calendar") {
      fetchStudyLogs();
    }
  }, [activeTab]);

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
  const fetchLearningData = async () => {
    try {
      setLoadingLearning(true);
      const [streak, weakness, score, plan, history, learnedIds] =
        await Promise.all([
          getStreakInfo(),
          getWeaknessAnalysis(),
          getScorePrediction(),
          getCurrentStudyPlan(),
          getStudyPlanHistory(),
          fetchLearnedWordIds().catch(() => []),
        ]);
      setStreakData(streak);
      setWeaknessData(weakness || []);
      setScoreData(score);
      setCurrentPlan(plan);
      setSelectedPlan(plan);
      setPlanHistory(history || []);
      setTotalLearnedWordsCount(learnedIds ? learnedIds.length : 0);
    } catch (error) {
      console.error("Error fetching advanced learning data:", error);
    } finally {
      setLoadingLearning(false);
    }
  };

  useEffect(() => {
    fetchLearningData();
  }, []);

  // Tự động set tab ngày đầu tiên khi selectedPlan thay đổi
  useEffect(() => {
    if (selectedPlan?.tasks && selectedPlan.tasks.length > 0) {
      const dates = [
        ...new Set(selectedPlan.tasks.map((t) => t.plan_date)),
      ].sort();
      setSelectedPlanTab(dates[0]);
    } else {
      setSelectedPlanTab(null);
    }
  }, [selectedPlan]);

  const handleToggleTask = async (taskId) => {
    try {
      const updatedTask = await toggleStudyPlanTask(taskId);

      // Cập nhật tasks trong selectedPlan
      const updatedTasks = selectedPlan.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: updatedTask.completed,
              completed_at: updatedTask.completed_at,
            }
          : task,
      );

      const newSelectedPlan = { ...selectedPlan, tasks: updatedTasks };
      setSelectedPlan(newSelectedPlan);

      // Cập nhật trong planHistory
      setPlanHistory((prev) =>
        prev.map((p) => (p.id === selectedPlan.id ? newSelectedPlan : p)),
      );

      // Cập nhật trong currentPlan
      if (currentPlan && currentPlan.id === selectedPlan.id) {
        setCurrentPlan(newSelectedPlan);
      }

      toast.success(
        updatedTask.completed
          ? "Đã hoàn thành nhiệm vụ! 🎉"
          : "Đã đánh dấu chưa hoàn thành.",
      );
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật trạng thái nhiệm vụ");
    }
  };

  const getContentUrl = (taskType, contentId) => {
    switch (taskType) {
      case "ARTICLE":
        return `/client/article/${contentId}`;
      case "VIDEO":
        return `/client/video/${contentId}`;
      case "VOCAB_DECK":
        return `/client/vocabulary/${contentId}`;
      case "TOEIC_TEST":
        return `/client/toeic/${contentId}`;
      default:
        return "/client";
    }
  };

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
                className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 rounded-md ${
                  activeTab === "coach"
                    ? "text-neutral-900 dark:text-white bg-white dark:bg-neutral-700 shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                AI Study Coach
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 rounded-md ${
                  activeTab === "calendar"
                    ? "text-neutral-900 dark:text-white bg-white dark:bg-neutral-700 shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                Lịch học
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 rounded-md ${
                  activeTab === "analytics"
                    ? "text-neutral-900 dark:text-white bg-white dark:bg-neutral-700 shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                Đánh giá TOEIC
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 rounded-md ${
                  activeTab === "activity"
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
                <AiStudyCoachTab
                  planHistory={planHistory}
                  selectedPlan={selectedPlan}
                  setSelectedPlan={setSelectedPlan}
                  selectedPlanTab={selectedPlanTab}
                  setSelectedPlanTab={setSelectedPlanTab}
                  handleToggleTask={handleToggleTask}
                  getContentUrl={getContentUrl}
                  fetchLearningData={fetchLearningData}
                />
              )}

              {/* TAB CALENDAR: SCHEDULE TIME-TABLE GRID */}
              {activeTab === "calendar" && (
                <StudyCalendar logs={studyLogs} loading={loadingCalendar} />
              )}

              {/* TAB 2: ANALYTICS & SCORE PREDICTION */}
              {activeTab === "analytics" && (
                <ToeicAnalyticsTab
                  streakData={streakData}
                  weaknessData={weaknessData}
                  scoreData={scoreData}
                  totalLearnedWordsCount={totalLearnedWordsCount}
                  radarChartData={radarChartData}
                  radarChartOptions={radarChartOptions}
                  todayStudyMins={todayStudyMins}
                  computedPercent={computedPercent}
                  strokeWidth={strokeWidth}
                  strokeDashoffset={strokeDashoffset}
                  circleRadius={circleRadius}
                  circumference={circumference}
                  goalMins={goalMins}
                />
              )}

              {/* TAB 3: SYSTEM ACTIVITY STATS */}
              {activeTab === "activity" && (
                <SystemActivityTab
                  dates={dates}
                  handleRangeChange={handleRangeChange}
                  preset={preset}
                  setPreset={setPreset}
                  fetchMyChartData={fetchMyChartData}
                  loadingActivity={loadingActivity}
                  totalAiRequests={totalAiRequests}
                  totalTokens={totalTokens}
                  totalDictQueries={totalDictQueries}
                  totalDictLocal={totalDictLocal}
                  totalDictApi={totalDictApi}
                  totalGgTranslations={totalGgTranslations}
                  totalCharsTranslated={totalCharsTranslated}
                  totalLogins={totalLogins}
                  totalEmails={totalEmails}
                  totalUploads={totalUploads}
                  chartData={chartData}
                />
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Learning Goal Setup Modal */}
      <LearningGoalModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSaveSuccess={fetchLearningData}
      />
    </AnimatePresence>
  );
};

export default Dashboard;

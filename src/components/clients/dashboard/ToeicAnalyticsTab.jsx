import {
  Flame,
  Award,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  MinusCircle,
} from "lucide-react";
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

// Register Radial scale for Radar chart
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

export default function ToeicAnalyticsTab({
  streakData,
  weaknessData,
  scoreData,
  totalLearnedWordsCount,
  radarChartData,
  radarChartOptions,
  todayStudyMins,
  computedPercent,
  strokeWidth,
  strokeDashoffset,
  circleRadius,
  circumference,
  goalMins,
}) {
  const dailyLog = streakData?.daily_study_log || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
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
            <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/50 pt-2 mt-1">
              <span>Từ vựng đã thuộc:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {totalLearnedWordsCount} từ
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
              <Flame className="mx-auto text-orange-500 mb-1" size={24} />
              <span className="text-2xl font-light text-neutral-900 dark:text-white">
                {streakData?.current_streak || 0}
              </span>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium mt-1">
                STREAK HIỆN TẠI
              </p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-md text-center border border-neutral-200 dark:border-neutral-800">
              <Award className="mx-auto text-yellow-500 mb-1" size={24} />
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
            <Radar data={radarChartData} options={radarChartOptions} />
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
                Luyện tập ít nhất 1 đề thi full test để kích hoạt tính năng dự
                đoán điểm và phân tích xu hướng học tập.
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
                  <span
                    className={`font-semibold ${scoreData.trend_bonus > 0 ? "text-green-500" : scoreData.trend_bonus < 0 ? "text-red-500" : "text-neutral-400"}`}
                  >
                    {scoreData.trend_bonus || 0}
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
                        <TrendingUp size={12} className="text-green-500" />
                        <span className="text-green-500">Đang cải thiện</span>
                      </>
                    )}
                    {scoreData.trend === "STABLE" && (
                      <>
                        <MinusCircle size={12} className="text-blue-500" />
                        <span className="text-blue-500">Ổn định</span>
                      </>
                    )}
                    {scoreData.trend === "DECLINING" && (
                      <>
                        <TrendingDown size={12} className="text-red-500" />
                        <span className="text-red-500">Suy giảm</span>
                      </>
                    )}
                    {(!scoreData.trend ||
                      !["IMPROVING", "STABLE", "DECLINING"].includes(
                        scoreData.trend,
                      )) && <span className="text-neutral-400">Chưa có</span>}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

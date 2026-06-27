import React, { useMemo } from "react";
import { BarChart3, Clock, Calendar, CheckCircle2, Award } from "lucide-react";
import { formatDate } from "@/utils/FormatDate";

const TestDetailSidebar = ({ sessions = [], loading = false }) => {
  const stats = useMemo(() => {
    if (!sessions || sessions.length === 0) return null;

    const totalAttempts = sessions.length;
    const bestSession = [...sessions].sort((a, b) => {
      const scoreA = a.total_score ?? 0;
      const scoreB = b.total_score ?? 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (b.correct_count ?? 0) - (a.correct_count ?? 0);
    })[0];

    const avgCorrect = Math.round(
      sessions.reduce((sum, s) => sum + (s.correct_count ?? 0), 0) /
        totalAttempts,
    );
    const avgTime = Math.round(
      sessions.reduce((sum, s) => sum + (s.time_spent ?? 0), 0) / totalAttempts,
    );

    return {
      totalAttempts,
      avgCorrect,
      avgTime,
      best: bestSession,
    };
  }, [sessions]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        <div className="h-28 bg-neutral-100 dark:bg-neutral-900 rounded-lg"></div>
        <div className="h-28 bg-neutral-100 dark:bg-neutral-900 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 ${stats?.best ? "md:grid-cols-2" : ""} gap-4`}
    >
      {/* Overview Stats */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 pb-1.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
          <BarChart3 className="text-brand-500" size={16} />
          <span className="text-sm">Thống kê luyện tập</span>
        </h3>

        {stats ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500">Số lần làm bài:</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                {stats.totalAttempts} lần
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500">Đúng trung bình:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20 px-2 py-0.5 rounded">
                {stats.avgCorrect} câu
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500">Thời gian trung bình:</span>
              <span className="font-bold text-brand-600 dark:text-brand-500 bg-brand-50 dark:bg-brand-950/30 border border-brand-100/50 dark:border-brand-900/20 px-2 py-0.5 rounded">
                {stats.avgTime} phút
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 py-1">
            Bạn chưa có dữ liệu làm bài.
          </p>
        )}
      </div>

      {/* Best Attempt Details */}
      {stats?.best && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 pb-1.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
            <Award className="text-brand-500" size={16} />
            <span className="text-sm">Lần làm cao nhất</span>
          </h3>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 flex items-center gap-1.5">
                <Calendar size={13} className="text-neutral-400" />
                Ngày làm:
              </span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {formatDate(stats.best.started_at)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-neutral-400" />
                Đúng:
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-500">
                {stats.best.correct_count ?? 0} /{" "}
                {stats.best.total_questions ?? 200} câu
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 flex items-center gap-1.5">
                <Award size={13} className="text-neutral-400" />
                Điểm số:
              </span>
              <span className="font-bold text-brand-600 dark:text-brand-500">
                {stats.best.total_score}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 flex items-center gap-1.5">
                <Clock size={13} className="text-neutral-400" />
                Thời gian (phút):
              </span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                {stats.best.time_spent}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Chế độ:</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {stats.best.mode === "FULL_TEST"
                  ? "Thi Full Test"
                  : "Luyện tập"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDetailSidebar;

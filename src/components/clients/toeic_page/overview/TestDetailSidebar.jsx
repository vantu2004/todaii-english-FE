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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div className="h-32 bg-neutral-100 dark:bg-neutral-850 rounded-3xl"></div>
        <div className="h-32 bg-neutral-100 dark:bg-neutral-850 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 ${stats?.best ? "md:grid-cols-2" : ""} gap-6`}
    >
      {/* Overview Stats */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm">
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 pb-2 border-b border-neutral-100/80 dark:border-neutral-800 flex items-center gap-2">
          <BarChart3 className="text-brand-500" size={18} />
          <span>Thống kê luyện tập</span>
        </h3>

        {stats ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">Số lần làm bài:</span>
              <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-lg">
                {stats.totalAttempts} lần
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">Đúng trung bình:</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20 px-2.5 py-0.5 rounded-lg">
                {stats.avgCorrect} câu
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">
                Thời gian trung bình:
              </span>
              <span className="text-sm font-bold text-brand-600 dark:text-brand-450 bg-brand-50 dark:bg-brand-950/30 border border-brand-100/50 dark:border-brand-900/20 px-2.5 py-0.5 rounded-lg">
                {stats.avgTime} phút
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-400 dark:text-neutral-500 py-2">
            Bạn chưa có dữ liệu làm bài.
          </p>
        )}
      </div>

      {/* Best Attempt Details */}
      {stats?.best && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-3xl p-6 shadow-sm">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 pb-2 border-b border-neutral-100/80 dark:border-neutral-800 flex items-center gap-2">
            <Award className="text-brand-500" size={18} />
            <span>Lần làm cao nhất</span>
          </h3>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 flex items-center gap-1.5">
                <Calendar size={14} className="text-neutral-400" />
                Ngày làm:
              </span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {formatDate(stats.best.started_at)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-neutral-400" />
                Đúng:
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-450">
                {stats.best.correct_count ?? 0} /{" "}
                {stats.best.total_questions ?? 200} câu
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 flex items-center gap-1.5">
                <Award size={14} className="text-neutral-400" />
                Điểm số:
              </span>
              <span className="font-bold text-brand-600 dark:text-brand-450">
                {stats.best.total_score}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 flex items-center gap-1.5">
                <Clock size={14} className="text-neutral-400" />
                Thời gian (phút):
              </span>
              <span className="font-semibold text-neutral-850 dark:text-neutral-200">
                {stats.best.time_spent}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
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

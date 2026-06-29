import React from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle2, Award } from "lucide-react";
import { formatDate } from "@/utils/FormatDate";

const SessionHistoryTable = ({ sessions = [], loading = false }) => {
  if (loading) {
    return (
      <div className="w-full space-y-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="py-6 text-center text-neutral-500 dark:text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/10">
        <Award
          className="mx-auto text-neutral-300 dark:text-neutral-700 mb-2"
          size={28}
        />
        <p className="text-sm font-medium">Bạn chưa làm đề thi này lần nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle px-4 sm:px-0">
        <div className="overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg">
          <table className="min-w-full divide-y divide-neutral-100 dark:divide-neutral-800">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Ngày làm
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Chế độ
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Số câu
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Điểm số
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Thời gian (phút)
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Phần đã làm
                </th>
                <th
                  scope="col"
                  className="px-4 py-2.5 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
              {sessions.map((session) => {
                const parts = session.parts_done
                  ? session.parts_done.split(",")
                  : [];

                const isInProgress = session.status === "IN_PROGRESS";

                return (
                  <tr
                    key={session.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors"
                  >
                    <td className="px-4 py-2.5 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                      {formatDate(session.started_at)}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-sm">
                      {isInProgress ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100/55 dark:border-amber-900/20">
                          Đang làm
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-500 border border-emerald-100/55 dark:border-emerald-900/20">
                          Đã hoàn thành
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-sm">
                      {session.mode === "FULL_TEST" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 border border-brand-100/50 dark:border-brand-500/20">
                          Full Test
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20">
                          Luyện tập
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-sm">
                      <div className="flex flex-col gap-0.5 text-xs font-medium">
                        <span className="text-emerald-700 dark:text-emerald-500">
                          Đúng: {session.correct_count ?? 0}
                        </span>
                        <span className="text-red-700 dark:text-red-400">
                          Sai: {session.incorrect_count ?? 0}
                        </span>
                        <span className="text-neutral-500 dark:text-neutral-500">
                          Bỏ qua: {session.skipped_count ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-900 dark:text-white text-sm">
                          {session.total_score ?? 0}
                        </span>
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                          L: {session.score_l ?? 0} | R: {session.score_r ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock size={13} className="text-neutral-400" />
                        <span>{session.time_spent}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {parts.map((p) => (
                          <span
                            key={p}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/30 dark:border-neutral-700/50"
                          >
                            Part {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-sm font-semibold">
                      {isInProgress ? (
                        <Link
                          to={`/client/toeic/exam/${session.id}`}
                          className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 transition-colors"
                        >
                          Tiếp tục làm
                        </Link>
                      ) : (
                        <Link
                          to={`/client/toeic/result/${session.id}`}
                          className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionHistoryTable;

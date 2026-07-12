import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import UserLearningProfileWidget from "@/components/clients/UserLearningProfileWidget";

export default function AiStudyCoachTab({
  planHistory,
  selectedPlan,
  setSelectedPlan,
  selectedPlanTab,
  setSelectedPlanTab,
  handleToggleTask,
  getContentUrl,
  fetchLearningData,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left panel: Plan History */}
      <div className="lg:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 h-fit animate-fade-in">
        <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Calendar size={14} />
          Lộ trình trước đây
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {planHistory.length === 0 ? (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 italic py-2">
              Chưa có lịch sử lộ trình
            </p>
          ) : (
            planHistory.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                  selectedPlan?.id === plan.id
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                }`}
              >
                {(() => {
                  const startDate = new Date(plan.created_at);
                  const endDate = new Date(startDate);
                  endDate.setDate(endDate.getDate() + 1);

                  return `Kế hoạch ${startDate.toLocaleDateString("vi-VN")} - ${endDate.toLocaleDateString("vi-VN")}`;
                })()}
              </button>
            ))
          )}
        </div>

        {/* Target Goal Section */}
        <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
          <UserLearningProfileWidget onProfileUpdated={fetchLearningData} />
        </div>
      </div>

      {/* Right panel: Plan Content */}
      <div className="lg:col-span-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 animate-fade-in">
        {selectedPlan ? (
          selectedPlan.tasks && selectedPlan.tasks.length > 0 ? (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2 m-0">
                  <Sparkles
                    size={18}
                    className="text-brand-500 animate-pulse"
                  />
                  Lộ trình học AI Coach
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                  Khởi tạo:{" "}
                  {new Date(selectedPlan.created_at).toLocaleDateString(
                    "vi-VN",
                  )}
                </span>
              </div>

              {/* Progress section */}
              {(() => {
                const totalTasks = selectedPlan.tasks.length;
                const completedTasks = selectedPlan.tasks.filter(
                  (t) => t.completed,
                ).length;
                const percent =
                  totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0;
                return (
                  <div className="mb-6 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Tiến độ lộ trình học tập
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Đã hoàn thành {completedTasks}/{totalTasks} nhiệm vụ (
                        {percent}%)
                      </div>
                    </div>
                    <div className="w-full sm:w-48 bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })()}

              {/* Day Tabs */}
              {(() => {
                const uniqueDates = [
                  ...new Set(selectedPlan.tasks.map((t) => t.plan_date)),
                ].sort();
                return (
                  <div className="flex border-b border-neutral-100 dark:border-neutral-800 mb-6 gap-2">
                    {uniqueDates.map((dateStr, idx) => {
                      const dateObj = new Date(dateStr);
                      const isSelected = selectedPlanTab === dateStr;
                      return (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedPlanTab(dateStr)}
                          className={`pb-3 px-4 text-sm font-medium transition-all relative ${
                            isSelected
                              ? "text-brand-500 dark:text-brand-400"
                              : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                          }`}
                        >
                          Ngày {idx + 1} (
                          {dateObj.toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                          )
                          {isSelected && (
                            <motion.div
                              layoutId="planActiveTabLine"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 dark:bg-brand-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Task List */}
              <div className="space-y-4">
                {(() => {
                  const dayTasks = selectedPlan.tasks.filter(
                    (t) => t.plan_date === selectedPlanTab,
                  );
                  if (dayTasks.length === 0) {
                    return (
                      <p className="text-sm text-neutral-400 dark:text-neutral-500 italic py-4 text-center">
                        Không có nhiệm vụ nào cho ngày này.
                      </p>
                    );
                  }
                  return dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                        task.completed
                          ? "bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-100 dark:border-neutral-800/40 opacity-70"
                          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-brand-500/30 dark:hover:border-brand-500/20 hover:shadow-md"
                      }`}
                    >
                      {/* Custom Checkbox */}
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-1 flex-shrink-0 transition-all active:scale-95 p-0.5"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-neutral-900" />
                        ) : (
                          <div className="w-5 h-5 rounded border-2 border-neutral-300 dark:border-neutral-600 hover:border-brand-500 transition-colors" />
                        )}
                      </button>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {/* Badge Type */}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              task.task_type === "ARTICLE"
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40" +
                                  " dark:text-blue-400 border border-blue-100" +
                                  " dark:border-blue-900/30"
                                : task.task_type === "VIDEO"
                                  ? "bg-red-50 text-red-600 dark:bg-red-950/40" +
                                    " dark:text-red-400 border border-red-100" +
                                    " dark:border-red-900/30"
                                  : task.task_type === "VOCAB_DECK"
                                    ? "bg-emerald-50 text-emerald-600" +
                                      " dark:bg-emerald-950/40 dark:text-emerald-400" +
                                      " border border-emerald-100" +
                                      " dark:border-emerald-900/30"
                                    : "bg-purple-50 text-purple-600" +
                                      " dark:bg-purple-950/40 dark:text-purple-400" +
                                      " border border-purple-100" +
                                      " dark:border-purple-900/30"
                            }`}
                          >
                            {task.task_type === "ARTICLE"
                              ? "Bài viết"
                              : task.task_type === "VIDEO"
                                ? "Video"
                                : task.task_type === "VOCAB_DECK"
                                  ? "Từ vựng"
                                  : "Đề thi"}
                          </span>

                          {/* Badge in-progress */}
                          {task.in_progress && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                              Học tiếp
                            </span>
                          )}

                          {/* Estimated minutes */}
                          <span className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500 ml-auto">
                            <Clock size={12} />
                            {task.estimated_minutes} phút
                          </span>
                        </div>

                        {/* Clickable Title */}
                        <Link
                          to={getContentUrl(task.task_type, task.content_id)}
                          className={`text-sm font-semibold hover:text-brand-500 transition-colors block ${
                            task.completed
                              ? "text-neutral-400 line-through"
                              : "text-neutral-800 dark:text-neutral-200"
                          }`}
                        >
                          {task.title}
                        </Link>

                        {/* AI Description */}
                        {task.description && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Link Indicator Icon */}
                      <Link
                        to={getContentUrl(task.task_type, task.content_id)}
                        className="self-center text-neutral-300 hover:text-brand-500 transition-colors p-1"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  ));
                })()}
              </div>
            </div>
          ) : (
            // Fallback cho plan cũ (Markdown content)
            <article className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2 m-0">
                  <Sparkles size={18} className="text-brand-500" />
                  Lộ trình học AI Coach
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                  Khởi tạo:{" "}
                  {new Date(selectedPlan.created_at).toLocaleDateString(
                    "vi-VN",
                  )}
                </span>
              </div>
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-5">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mt-6 mb-3">
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 leading-7">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc ml-6 space-y-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal ml-6 space-y-2">{children}</ol>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-bold">{children}</strong>
                  ),
                }}
              >
                {selectedPlan.content}
              </ReactMarkdown>
            </article>
          )
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
              Hệ thống AI Coach sẽ phân tích kết quả học của bạn và gửi lộ trình
              đầu tiên vào thứ Hai hàng tuần. Hãy duy trì học tập đều đặn nhé!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

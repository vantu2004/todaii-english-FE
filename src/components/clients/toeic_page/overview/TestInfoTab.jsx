import React from "react";
import { Headphones, BookText, AlertCircle } from "lucide-react";
import { formatDate } from "@/utils/FormatDate";
import SessionHistoryTable from "./SessionHistoryTable";

const TestInfoTab = ({ test, sessions = [], loadingSessions = false }) => {
  const bestSession = React.useMemo(() => {
    if (!sessions || sessions.length === 0) return null;
    return [...sessions].sort((a, b) => {
      const scoreA = a.total_score ?? 0;
      const scoreB = b.total_score ?? 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (b.correct_count ?? 0) - (a.correct_count ?? 0);
    })[0];
  }, [sessions]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Listening & Reading Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 p-5 rounded-2xl flex items-start gap-4">
          <div className="mt-1 bg-blue-100/70 dark:bg-blue-900/40 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <Headphones size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
              Phần Nghe (Listening)
            </h3>
            <p className="text-sm text-neutral-550 dark:text-neutral-400 leading-relaxed">
              Bao gồm Part 1 đến Part 4. Thời gian làm bài 45 phút. 100 câu hỏi
              đánh giá kỹ năng nghe hiểu tiếng Anh thông qua các đoạn hội thoại
              và bài nói ngắn.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 p-5 rounded-2xl flex items-start gap-4">
          <div className="mt-1 bg-emerald-100/70 dark:bg-emerald-900/40 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-450 shrink-0">
            <BookText size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
              Phần Đọc (Reading)
            </h3>
            <p className="text-sm text-neutral-550 dark:text-neutral-400 leading-relaxed">
              Bao gồm Part 5 đến Part 7. Thời gian làm bài 75 phút. 100 câu hỏi
              đánh giá vốn từ vựng, ngữ pháp và khả năng đọc hiểu văn bản tiếng
              Anh.
            </p>
          </div>
        </div>
      </div>

      {/* Notice Box */}
      <div className="p-4 border border-brand-100 dark:border-brand-900/30 bg-brand-50/50 dark:bg-brand-900/10 rounded-2xl flex items-start gap-3">
        <AlertCircle className="text-brand-500 shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-neutral-655 dark:text-neutral-400">
          <strong className="text-brand-600 dark:text-brand-400">Lưu ý:</strong>{" "}
          Bài thi sẽ được chấm điểm ngay sau khi bạn nộp bài. Đảm bảo kết nối
          mạng ổn định trong suốt quá trình làm bài. Bạn có thể tự do chuyển đổi
          giữa các phần.
        </p>
      </div>

      {/* Session History Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Lịch sử làm bài
        </h3>
        <SessionHistoryTable sessions={sessions} loading={loadingSessions} />
      </div>
    </div>
  );
};

export default TestInfoTab;

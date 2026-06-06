import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  BarChart3,
  AlertCircle,
  SkipForward,
} from "lucide-react";
import { getTestById } from "@/api/clients/toeicTestApi";
import { getSessionDetails } from "@/api/clients/toeicSessionApi";

const ToeicResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const fetchSessionResult = async () => {
      if (!sessionId) {
        navigate("/client/toeic");
        return;
      }

      try {
        const sessionData = await getSessionDetails(sessionId);

        // Read testId
        const currentTestId = sessionData.test_id;
        const testInfo = await getTestById(currentTestId);

        // Read scores from BE DTO
        const scoreL = sessionData.score_l ?? 0;
        const scoreR = sessionData.score_r ?? 0;
        const totalScore = sessionData.total_score ?? 0;
        const correctCount = sessionData.correct_count ?? 0;
        const incorrectCount = sessionData.incorrect_count ?? 0;
        const skippedCount = sessionData.skipped_count ?? 0;
        const timeSpentMinutes = sessionData.time_spent ?? 0;

        // Compute elapsed time from started_at → completed_at (or stopped_at) for display
        const startedAt = sessionData.started_at;
        const completedAt = sessionData.completed_at || sessionData.stopped_at;
        let elapsedSeconds = timeSpentMinutes * 60; // fallback
        if (startedAt && completedAt) {
          elapsedSeconds = Math.max(
            0,
            Math.floor(
              (new Date(completedAt).getTime() -
                new Date(startedAt).getTime()) /
                1000,
            ),
          );
        }

        const totalAnswered = correctCount + incorrectCount;
        const totalQuestions = totalAnswered + skippedCount;

        const partsDoneStr = sessionData.parts_done || "";
        const mode = sessionData.mode;
        const isFullTest = mode === "FULL_TEST";

        setResultData({
          testId: currentTestId,
          testName: testInfo.title,
          scoreL,
          scoreR,
          totalScore,
          correctCount,
          incorrectCount,
          skippedCount,
          totalAnswered,
          totalQuestions,
          elapsedSeconds,
          isFullTest,
          partsDone: partsDoneStr,
        });
      } catch (err) {
        console.error("Failed to load session result", err);
        navigate("/client/toeic");
      }
    };

    fetchSessionResult();
  }, [sessionId, navigate]);

  if (!resultData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mt-[68px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const accuracy =
    resultData.totalAnswered > 0
      ? Math.round((resultData.correctCount / resultData.totalAnswered) * 100)
      : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-[68px]">
      <Link
        to="/client/toeic"
        className="inline-flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors mb-8 font-medium"
      >
        <ArrowLeft size={18} />
        <span>Về danh sách đề thi</span>
      </Link>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-10 shadow-sm border border-neutral-100 dark:border-neutral-800 mb-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-50 dark:bg-brand-500/10 rounded-full mb-4">
            <Trophy className="text-brand-500 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2">
            Kết Quả Bài Thi
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">
            {resultData.testName}
          </p>
        </div>

        {/* Score Cards */}
        {resultData.isFullTest ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 text-center border border-blue-100 dark:border-blue-800/30">
              <h3 className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                Điểm Nghe (Listening)
              </h3>
              <div className="text-4xl font-extrabold text-blue-700 dark:text-blue-300 mb-2">
                {resultData.scoreL}
              </div>
              <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                / 495
              </p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 text-center border border-emerald-100 dark:border-emerald-800/30">
              <h3 className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                Điểm Đọc (Reading)
              </h3>
              <div className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-2">
                {resultData.scoreR}
              </div>
              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                / 495
              </p>
            </div>

            <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-6 text-center border border-brand-100 dark:border-brand-800/30 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                TỔNG ĐIỂM
              </div>
              <h3 className="text-brand-600 dark:text-brand-400 font-semibold mb-2">
                Total Score
              </h3>
              <div className="text-5xl font-black text-brand-700 dark:text-brand-300 mb-2">
                {resultData.totalScore}
              </div>
              <p className="text-sm text-brand-600/80 dark:text-brand-400/80">
                / 990
              </p>
            </div>
          </div>
        ) : (
          /* Practice mode — show correct/incorrect/skipped summary */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 text-center border border-emerald-100 dark:border-emerald-800/30">
              <h3 className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                Câu đúng
              </h3>
              <div className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-2">
                {resultData.correctCount}
              </div>
              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                / {resultData.totalQuestions} câu
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 text-center border border-red-100 dark:border-red-800/30">
              <h3 className="text-red-600 dark:text-red-400 font-semibold mb-2">
                Câu sai
              </h3>
              <div className="text-4xl font-extrabold text-red-700 dark:text-red-300 mb-2">
                {resultData.incorrectCount}
              </div>
              <p className="text-sm text-red-600/80 dark:text-red-400/80">
                / {resultData.totalQuestions} câu
              </p>
            </div>

            <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-6 text-center border border-brand-100 dark:border-brand-800/30 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                ĐỘ CHÍNH XÁC
              </div>
              <h3 className="text-brand-600 dark:text-brand-400 font-semibold mb-2">
                Accuracy
              </h3>
              <div className="text-5xl font-black text-brand-700 dark:text-brand-300 mb-2">
                {accuracy}%
              </div>
              <p className="text-sm text-brand-600/80 dark:text-brand-400/80">
                {resultData.correctCount} / {resultData.totalAnswered} câu trả
                lời
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl mb-8">
          <div className="flex items-center gap-3">
            <Clock className="text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-500 font-medium">
                Thời gian làm bài
              </p>
              <p className="font-bold text-neutral-900 dark:text-white">
                {formatTime(resultData.elapsedSeconds)}
              </p>
            </div>
          </div>
          <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-700 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500" />
            <div>
              <p className="text-xs text-neutral-500 font-medium">
                Số câu đúng
              </p>
              <p className="font-bold text-neutral-900 dark:text-white">
                {resultData.correctCount} / {resultData.totalQuestions}
              </p>
            </div>
          </div>
          <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-700 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <XCircle className="text-red-500" />
            <div>
              <p className="text-xs text-neutral-500 font-medium">Số câu sai</p>
              <p className="font-bold text-neutral-900 dark:text-white">
                {resultData.incorrectCount}
              </p>
            </div>
          </div>
          <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-700 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <SkipForward className="text-amber-500" />
            <div>
              <p className="text-xs text-neutral-500 font-medium">Bỏ qua</p>
              <p className="font-bold text-neutral-900 dark:text-white">
                {resultData.skippedCount}
              </p>
            </div>
          </div>
          <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-700 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <BarChart3 className="text-blue-500" />
            <div>
              <p className="text-xs text-neutral-500 font-medium">
                Độ chính xác
              </p>
              <p className="font-bold text-neutral-900 dark:text-white">
                {resultData.totalAnswered > 0 ? `${accuracy}%` : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-brand-100 dark:border-brand-900/30 bg-brand-50/50 dark:bg-brand-900/10 rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-brand-500 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Đây là kết quả mang tính chất tham khảo. Kết quả thi thật có thể dao
            động tùy thuộc vào thang điểm chuẩn của ETS tại từng thời điểm.
          </p>
        </div>
      </div>

      {/* Detailed answers could be added here in the future */}
      <div className="text-center">
        <Link
          to={`/client/toeic/${resultData?.testId}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
        >
          Làm lại bài thi này
        </Link>
      </div>
    </div>
  );
};

export default ToeicResult;

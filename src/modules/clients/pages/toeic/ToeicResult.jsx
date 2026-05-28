import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  BarChart3,
  AlertCircle,
} from "lucide-react";

// TOEIC Score Conversion Table (simplified approximation)
// In a real app, this might be more complex or fetched from backend
const convertListeningScore = (correctCount) => {
  if (correctCount === 0) return 5;
  if (correctCount >= 100) return 495;
  // Simple linear approximation for demo purposes
  return Math.min(495, Math.round(correctCount * 4.95) + 5);
};

const convertReadingScore = (correctCount) => {
  if (correctCount === 0) return 5;
  if (correctCount >= 100) return 495;
  // Simple linear approximation for demo purposes
  return Math.min(495, Math.round(correctCount * 4.95) + 5);
};

const ToeicResult = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem(`toeic_result_${testId}`);
    if (data) {
      setResultData(JSON.parse(data));
    } else {
      navigate("/client/toeic");
    }
  }, [testId, navigate]);

  const scoreDetails = useMemo(() => {
    if (!resultData) return null;

    let listeningCorrect = 0;
    let listeningTotal = 0;
    let readingCorrect = 0;
    let readingTotal = 0;

    const { answers, testData } = resultData;
    const selectedPartIds = resultData.selectedPartIds || [1, 2, 3, 4, 5, 6, 7];
    
    // Process Part 1-4 (Listening)
    for (let part = 1; part <= 4; part++) {
      if (!selectedPartIds.includes(part)) continue;
      const questions = testData.questions[part] || [];
      questions.forEach((q) => {
        listeningTotal++;
        if (answers[q.id] === q.correct_ans) {
          listeningCorrect++;
        }
      });
    }

    // Process Part 5-7 (Reading)
    for (let part = 5; part <= 7; part++) {
      if (!selectedPartIds.includes(part)) continue;
      const questions = testData.questions[part] || [];
      questions.forEach((q) => {
        readingTotal++;
        if (answers[q.id] === q.correct_ans) {
          readingCorrect++;
        }
      });
    }

    const listeningScore = listeningTotal > 0 
      ? convertListeningScore((listeningCorrect / listeningTotal) * 100) 
      : 0;
    const readingScore = readingTotal > 0 
      ? convertReadingScore((readingCorrect / readingTotal) * 100) 
      : 0;
    const totalScore = listeningScore + readingScore;
    const maxScore = (listeningTotal > 0 ? 495 : 0) + (readingTotal > 0 ? 495 : 0);

    return {
      listening: { correct: listeningCorrect, total: listeningTotal, score: listeningScore },
      reading: { correct: readingCorrect, total: readingTotal, score: readingScore },
      totalScore,
      maxScore: maxScore || 990
    };
  }, [resultData]);

  if (!resultData || !scoreDetails) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mt-[68px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 text-center border border-blue-100 dark:border-blue-800/30">
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
              Điểm Nghe (Listening)
            </h3>
            <div className="text-4xl font-extrabold text-blue-700 dark:text-blue-300 mb-2">
              {scoreDetails.listening.total === 0 ? "Không làm" : scoreDetails.listening.score}
            </div>
            <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
              {scoreDetails.listening.total === 0 ? "—" : `${scoreDetails.listening.correct} / ${scoreDetails.listening.total} câu đúng`}
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 text-center border border-emerald-100 dark:border-emerald-800/30">
            <h3 className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
              Điểm Đọc (Reading)
            </h3>
            <div className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-2">
              {scoreDetails.reading.total === 0 ? "Không làm" : scoreDetails.reading.score}
            </div>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
              {scoreDetails.reading.total === 0 ? "—" : `${scoreDetails.reading.correct} / ${scoreDetails.reading.total} câu đúng`}
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
              {scoreDetails.maxScore === 0 ? "—" : scoreDetails.totalScore}
            </div>
            <p className="text-sm text-brand-600/80 dark:text-brand-400/80">
              / {scoreDetails.maxScore}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl mb-8">
          <div className="flex items-center gap-3">
            <Clock className="text-neutral-500" />
            <div>
              <p className="text-xs text-neutral-500 font-medium">
                Thời gian làm bài
              </p>
              <p className="font-bold text-neutral-900 dark:text-white">
                {formatTime(resultData.timeSpent)}
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
                {scoreDetails.listening.correct + scoreDetails.reading.correct}{" "}
                / {scoreDetails.listening.total + scoreDetails.reading.total}
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
                {scoreDetails.listening.total + scoreDetails.reading.total > 0 
                  ? `${Math.round(((scoreDetails.listening.correct + scoreDetails.reading.correct) / (scoreDetails.listening.total + scoreDetails.reading.total)) * 100)}%`
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-brand-100 dark:border-brand-900/30 bg-brand-50/50 dark:bg-brand-900/10 rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-brand-500 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Đây là kết quả mang tính chất tham khảo. Kết quả thi thật có thể dao
            động tùy thuộc vào thang điểm chuẩn của EST tại từng thời điểm.
          </p>
        </div>
      </div>

      {/* Detailed answers could be added here in the future */}
      <div className="text-center">
        <Link
          to={`/client/toeic/${testId}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
        >
          Làm lại bài thi này
        </Link>
      </div>
    </div>
  );
};

export default ToeicResult;

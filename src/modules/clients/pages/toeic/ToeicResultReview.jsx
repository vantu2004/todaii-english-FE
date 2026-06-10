import React, { useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Map,
  X,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Trophy,
  Loader2,
} from "lucide-react";

import QuestionItemReview from "@/components/clients/toeic_page/result_review/QuestionItemReview";
import PassageGroupReview from "@/components/clients/toeic_page/result_review/PassageGroupReview";
import QuestionNavigatorReview from "@/components/clients/toeic_page/result_review/QuestionNavigatorReview";
import { useToeicResultData } from "@/hooks/clients/toeic_session/useToeicResultData";

const PARTS = [
  { id: 1, name: "Part 1: Photographs" },
  { id: 2, name: "Part 2: Question-Response" },
  { id: 3, name: "Part 3: Conversations" },
  { id: 4, name: "Part 4: Talks" },
  { id: 5, name: "Part 5: Incomplete Sentences" },
  { id: 6, name: "Part 6: Text Completion" },
  { id: 7, name: "Part 7: Reading Comprehension" },
];

// ─── Score Summary bar ────────────────────────────────────────────────────────
// Dùng session.correct_count / incorrect_count / skipped_count từ BE
// (đã được tính sẵn khi submit, không cần tự đếm lại)
const ScoreSummary = ({ session }) => {
  if (!session) return null;

  const total =
    (session.correct_count ?? 0) +
    (session.incorrect_count ?? 0) +
    (session.skipped_count ?? 0);
  const accuracy =
    total > 0 ? Math.round(((session.correct_count ?? 0) / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 flex flex-wrap items-center gap-4">
      {/* Total score */}
      {session.total_score != null && (
        <div className="flex items-center gap-2">
          <Trophy size={15} className="text-amber-500" />
          <span className="text-sm font-bold text-neutral-900 dark:text-white">
            {session.total_score}
            <span className="text-neutral-400 font-normal"> điểm</span>
          </span>
          {session.score_l != null && session.score_r != null && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              (L: {session.score_l} / R: {session.score_r})
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-sm">
        <CheckCircle2 size={14} className="text-green-500" />
        <span className="font-bold text-green-600 dark:text-green-400">
          {session.correct_count ?? 0}
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">đúng</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm">
        <XCircle size={14} className="text-red-500" />
        <span className="font-bold text-red-600 dark:text-red-400">
          {session.incorrect_count ?? 0}
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">sai</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm">
        <MinusCircle size={14} className="text-neutral-400" />
        <span className="font-bold text-neutral-500 dark:text-neutral-400">
          {session.skipped_count ?? 0}
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">bỏ qua</span>
      </div>

      {/* Accuracy bar */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="w-28 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${accuracy}%` }}
          />
        </div>
        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
          {accuracy}%
        </span>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ToeicResultReview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { loading, session, test, selectedPartIds, partItems, answers } =
    useToeicResultData(sessionId);

  const [currentPart, setCurrentPart] = useState(null);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const questionRefs = useRef({});

  // Set currentPart khi data load xong
  React.useEffect(() => {
    if (selectedPartIds.length > 0 && currentPart === null) {
      setCurrentPart(selectedPartIds[0]);
    }
  }, [selectedPartIds, currentPart]);

  // allQuestionsFlat — giống useToeicNavigation
  const allQuestionsFlat = useMemo(() => {
    const flat = [];
    let idx = 0;
    selectedPartIds.forEach((partId) => {
      (partItems[partId] || []).forEach((item) => {
        if (item.type === "question") {
          idx++;
          flat.push({
            id: item.data.id,
            partNumber: partId,
            questionNumber: idx,
          });
        } else {
          (item.data.questions || []).forEach((q) => {
            idx++;
            flat.push({ id: q.id, partNumber: partId, questionNumber: idx });
          });
        }
      });
    });
    return flat;
  }, [partItems, selectedPartIds]);

  const getQuestionNumber = (qId) => {
    const q = allQuestionsFlat.find((x) => x.id === qId);
    return q ? q.questionNumber : 1;
  };

  const handleNavigate = (qId) => {
    const q = allQuestionsFlat.find((x) => x.id === qId);
    if (!q) return;
    if (q.partNumber !== currentPart) setCurrentPart(q.partNumber);
    setTimeout(() => {
      const el = questionRefs.current[qId];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    setIsRightSidebarOpen(false);
  };

  const currentPartIndex = selectedPartIds.indexOf(currentPart);
  const hasPrev = currentPartIndex > 0;
  const hasNext = currentPartIndex < selectedPartIds.length - 1;

  // Render content part hiện tại
  const renderPartContent = () => {
    const items = partItems[currentPart] || [];
    if (!items.length) {
      return (
        <div className="text-center py-12 text-neutral-500">
          Không có dữ liệu cho phần này.
        </div>
      );
    }

    return items.map((item) => {
      if (item.type === "question") {
        const ans = answers[item.data.id] || {};
        return (
          <QuestionItemReview
            key={item.data.id}
            ref={(el) => {
              questionRefs.current[item.data.id] = el;
            }}
            question={item.data}
            questionNumber={getQuestionNumber(item.data.id)}
            userChoice={ans.user_choice ?? null}
            correctAns={ans.correct_ans ?? null}
            isMarked={ans.is_marked ?? false}
            status={ans.status ?? 2}
            optionCount={currentPart === 2 ? 3 : 4}
            partNumber={currentPart}
          />
        );
      } else {
        const passageQuestions = item.data.questions || [];
        const startNumber =
          passageQuestions.length > 0
            ? getQuestionNumber(passageQuestions[0].id)
            : 1;
        return (
          <PassageGroupReview
            key={item.data.id}
            passage={item.data}
            questions={passageQuestions}
            startNumber={startNumber}
            answers={answers}
            questionRefs={questionRefs}
            partNumber={currentPart}
          />
        );
      }
    });
  };

  // ── Part score summary ────────────────────────────────────────────────────
  const partStats = useMemo(() => {
    const partQs = allQuestionsFlat.filter((q) => q.partNumber === currentPart);
    const correct = partQs.filter((q) => answers[q.id]?.status === 1).length;
    return { correct, total: partQs.length };
  }, [allQuestionsFlat, answers, currentPart]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-primary dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-brand-500" />
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">
            Đang tải chi tiết đáp án...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-68px)] bg-surface-primary dark:bg-neutral-950 flex flex-col mt-[68px]">
      {/* ── Top Header ── */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-1.5 px-3 sm:px-4 flex items-center justify-between sticky top-[68px] z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
          <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
          <h1 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate max-w-[160px] md:max-w-sm">
            {test?.title}
          </h1>
          <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            Xem đáp án
          </span>
        </div>

        <button
          type="button"
          className="xl:hidden p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
          onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        >
          <Map size={16} />
        </button>
      </div>

      {/* ── Score Summary ── */}
      <ScoreSummary session={session} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* ── Main Content ── */}
        <div className="flex-1 overflow-y-auto bg-surface-primary dark:bg-neutral-950 p-2 sm:p-3 lg:p-4">
          <div className="max-w-6xl mx-auto">
            {/* Part title + part score */}
            <div className="mb-3 pb-1.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                {PARTS.find((p) => p.id === currentPart)?.name}
              </h2>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {partStats.correct}/{partStats.total} đúng
              </span>
            </div>

            <div className="pb-16">{renderPartContent()}</div>

            {/* Bottom Part Navigation */}
            <div className="fixed bottom-0 left-0 right-0 xl:right-80 p-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() =>
                  setCurrentPart(selectedPartIds[currentPartIndex - 1])
                }
                className="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
                <span>Phần trước</span>
              </button>

              {/* Part dots navigation */}
              <div className="flex gap-1.5">
                {selectedPartIds.map((pId) => (
                  <button
                    key={pId}
                    onClick={() => setCurrentPart(pId)}
                    className={`w-6 h-6 rounded text-[10px] font-bold transition-all ${
                      pId === currentPart
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {pId}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={!hasNext}
                onClick={() =>
                  setCurrentPart(selectedPartIds[currentPartIndex + 1])
                }
                className="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Phần tiếp</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar Desktop ── */}
        <div className="hidden xl:flex w-80 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex-col h-full">
          <QuestionNavigatorReview
            questions={allQuestionsFlat}
            answers={answers}
            onNavigate={handleNavigate}
          />
        </div>

        {/* ── Mobile Backdrop ── */}
        {isRightSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 xl:hidden"
            onClick={() => setIsRightSidebarOpen(false)}
          />
        )}

        {/* ── Mobile Right Drawer ── */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-neutral-900 shadow-2xl xl:hidden flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
            isRightSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-neutral-100 dark:border-neutral-800">
            <span className="font-bold text-neutral-900 dark:text-white">
              Bản đồ câu hỏi
            </span>
            <button
              onClick={() => setIsRightSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <QuestionNavigatorReview
              questions={allQuestionsFlat}
              answers={answers}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToeicResultReview;

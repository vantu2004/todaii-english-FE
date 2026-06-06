import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Map,
  X,
} from "lucide-react";

// Sub-components
import QuestionItem from "@/components/clients/toeic_page/taking_test/QuestionItem";
import PassageGroup from "@/components/clients/toeic_page/taking_test/PassageGroup";
import QuestionNavigator from "@/components/clients/toeic_page/taking_test/QuestionNavigator";
import SubmitConfirmDialog from "@/components/clients/toeic_page/taking_test/SubmitConfirmDialog";
import { useToeicTestSession } from "@/hooks/clients/useToeicTestSession";

const PARTS = [
  { id: 1, name: "Part 1: Photographs", type: "listening", hasPassage: false },
  {
    id: 2,
    name: "Part 2: Question-Response",
    type: "listening",
    hasPassage: false,
  },
  { id: 3, name: "Part 3: Conversations", type: "listening", hasPassage: true },
  { id: 4, name: "Part 4: Talks", type: "listening", hasPassage: true },
  {
    id: 5,
    name: "Part 5: Incomplete Sentences",
    type: "reading",
    hasPassage: false,
  },
  { id: 6, name: "Part 6: Text Completion", type: "reading", hasPassage: true },
  {
    id: 7,
    name: "Part 7: Reading Comprehension",
    type: "reading",
    hasPassage: true,
  },
];

const ToeicTakingTest = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const {
    session,
    test,
    loading,
    selectedPartIds,
    currentPart,
    partItems,
    answers,
    timeLeft,
    isFirstTime,
    saving,
    submitting,
    allQuestionsFlat,
    answeredCount,
    markedCount,
    unansweredCount,
    hasPreviousPart,
    hasNextPart,
    currentPartIndex,
    isRightSidebarOpen,
    setIsRightSidebarOpen,
    isSubmitDialogOpen,
    setIsSubmitDialogOpen,
    audioRef,
    questionRefs,
    getQuestionNumber,
    handleAnswerSelect,
    handleToggleMark,
    handleSaveAnswers,
    handleNavigateToQuestion,
    handlePreviousPart,
    handleNextPart,
    executeSubmit,
  } = useToeicTestSession(sessionId, navigate);

  const formatTime = (seconds) => {
    if (seconds === null) return "00:00:00";
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const renderPartContent = () => {
    const items = partItems[currentPart] || [];

    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-neutral-500">
          Không có dữ liệu cho phần này.
        </div>
      );
    }

    return items.map((item) => {
      if (item.type === "question") {
        const questionNumber = getQuestionNumber(item.data.id);
        return (
          <QuestionItem
            key={item.data.id}
            ref={(el) => {
              questionRefs.current[item.data.id] = el;
            }}
            question={item.data}
            questionNumber={questionNumber}
            selectedAnswer={answers[item.data.id]?.user_choice || null}
            isMarked={answers[item.data.id]?.is_marked || false}
            onSelectAnswer={handleAnswerSelect}
            onToggleMark={handleToggleMark}
            optionCount={currentPart === 2 ? 3 : 4}
            mode={session?.mode}
            partNumber={currentPart}
          />
        );
      } else {
        // passage
        const passageQuestions = item.data.questions || [];
        const startNumber =
          passageQuestions.length > 0
            ? getQuestionNumber(passageQuestions[0].id)
            : 1;
        return (
          <PassageGroup
            key={item.data.id}
            passage={item.data}
            questions={passageQuestions}
            startNumber={startNumber}
            answers={answers}
            onSelectAnswer={handleAnswerSelect}
            onToggleMark={handleToggleMark}
            optionCount={4}
            questionRefs={questionRefs}
            partNumber={currentPart}
            mode={session?.mode}
          />
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-primary dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">
            Đang chuẩn bị bài thi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-68px)] bg-surface-primary dark:bg-neutral-950 flex flex-col mt-[68px]">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-1.5 px-3 sm:px-4 flex items-center justify-between sticky top-[68px] z-45">
        <div className="flex items-center gap-3">
          <h1 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate max-w-[150px] md:max-w-md">
            {test?.title}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Global test audio for FULL TEST mode */}
          {session?.mode === "FULL_TEST" && test?.audio_url && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:inline">
                Audio Đề Thi:
              </span>
              <audio
                ref={audioRef}
                src={test.audio_url}
                controls
                controlsList="nodownload"
                autoPlay={isFirstTime}
                className="h-8 w-44 sm:w-64 focus:outline-none"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-medium">
            <CheckCircle2 size={12} className="text-brand-500" />
            <span className="text-neutral-700 dark:text-neutral-300">
              {answeredCount} / {allQuestionsFlat.length} đã làm
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-sm ${
              timeLeft !== null && timeLeft < 300
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-pulse"
                : "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
            }`}
          >
            <Clock size={14} />
            <span className="w-14 text-center tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>

          <button
            onClick={() => setIsSubmitDialogOpen(true)}
            className="px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            Nộp bài
          </button>

          <button
            type="button"
            className="xl:hidden p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            title="Bản đồ câu hỏi"
          >
            <Map size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-surface-primary dark:bg-neutral-950 p-2 sm:p-3 lg:p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-3 pb-1.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                {PARTS.find((p) => p.id === currentPart)?.name}
              </h2>
            </div>

            <div className="pb-12">{renderPartContent()}</div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 xl:right-80 p-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
              <button
                type="button"
                disabled={!hasPreviousPart}
                onClick={handlePreviousPart}
                className="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
                <span>Phần trước</span>
              </button>

              <div className="text-xs font-semibold text-neutral-500">
                Phần {currentPartIndex + 1} / {selectedPartIds.length}
              </div>

              <button
                type="button"
                disabled={!hasNextPart}
                onClick={handleNextPart}
                className="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Phần tiếp</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Question Navigator for Desktop */}
        <div className="hidden xl:block w-80 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex flex-col h-full">
          <QuestionNavigator
            questions={allQuestionsFlat}
            answers={answers}
            onNavigateToQuestion={handleNavigateToQuestion}
            onSave={() => handleSaveAnswers(true)}
            onSubmit={() => setIsSubmitDialogOpen(true)}
            saving={saving}
            submitting={submitting}
          />
        </div>

        {/* Backdrop for mobile right sidebar */}
        {isRightSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 xl:hidden"
            onClick={() => setIsRightSidebarOpen(false)}
          />
        )}

        {/* Mobile Right Sidebar: Slide-over Drawer for Question Navigator */}
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
            <QuestionNavigator
              questions={allQuestionsFlat}
              answers={answers}
              onNavigateToQuestion={(qId) => {
                handleNavigateToQuestion(qId);
                setIsRightSidebarOpen(false);
              }}
              onSave={() => {
                handleSaveAnswers(true);
                setIsRightSidebarOpen(false);
              }}
              onSubmit={() => {
                setIsSubmitDialogOpen(true);
                setIsRightSidebarOpen(false);
              }}
              saving={saving}
              submitting={submitting}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <SubmitConfirmDialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        onConfirm={executeSubmit}
        answeredCount={answeredCount}
        markedCount={markedCount}
        unansweredCount={unansweredCount}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default ToeicTakingTest;

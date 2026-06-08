import React, { useMemo } from "react";
import { Save, Send, Map } from "lucide-react";

const PARTS = [
  { id: 1, name: "Part 1" },
  { id: 2, name: "Part 2" },
  { id: 3, name: "Part 3" },
  { id: 4, name: "Part 4" },
  { id: 5, name: "Part 5" },
  { id: 6, name: "Part 6" },
  { id: 7, name: "Part 7" },
];

const QuestionNavigator = ({
  questions, // flat list: [{ id, partNumber, questionNumber }]
  answers, // object: { questionId: { user_choice, is_marked } }
  onNavigateToQuestion,
  onSave,
  onSubmit,
  saving,
  submitting,
}) => {
  // Group questions by part
  const groupedByPart = useMemo(() => {
    const groups = {};
    questions.forEach((q) => {
      if (!groups[q.partNumber]) {
        groups[q.partNumber] = [];
      }
      groups[q.partNumber].push(q);
    });
    return groups;
  }, [questions]);

  const answeredCount = questions.filter(
    (q) => answers[q.id]?.user_choice,
  ).length;
  const markedCount = questions.filter((q) => answers[q.id]?.is_marked).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="flex flex-col h-full text-xs sm:text-sm">
      {/* Header */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 mb-2">
          <Map size={14} className="text-neutral-500 dark:text-neutral-400" />
          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
            Bản đồ câu hỏi
          </h3>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
          <span>
            Đã làm: <strong className="text-brand-500">{answeredCount}</strong>
          </span>
          <span>
            Đánh dấu: <strong className="text-amber-500">{markedCount}</strong>
          </span>
          <span>
            Chưa làm:{" "}
            <strong className="text-neutral-400 dark:text-neutral-500">
              {unansweredCount}
            </strong>
          </span>
        </div>
      </div>

      {/* Question grid by part */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {Object.entries(groupedByPart).map(([partId, partQuestions]) => {
          const partInfo = PARTS.find((p) => p.id === Number(partId));
          return (
            <div key={partId}>
              <h4 className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5">
                {partInfo?.name || `Part ${partId}`}
              </h4>
              <div className="grid grid-cols-6 gap-1">
                {partQuestions.map((q) => {
                  const isAnswered = !!answers[q.id]?.user_choice;
                  const isMarkd = !!answers[q.id]?.is_marked;

                  let btnClass =
                    "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400";
                  if (isMarkd) {
                    btnClass = "bg-amber-500 text-white";
                  } else if (isAnswered) {
                    btnClass = "bg-brand-500 text-white";
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onNavigateToQuestion(q.id)}
                      className={`w-full aspect-square rounded text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all hover:opacity-90 ${btnClass}`}
                      title={`Câu ${q.questionNumber}${isMarkd ? " (đánh dấu)" : ""}${isAnswered ? " (đã làm)" : ""}`}
                    >
                      {q.questionNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-wrap gap-2.5 mb-3 text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
            <span>Chưa làm</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-brand-500" />
            <span>Đã làm</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span>Đánh dấu</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? "Đang lưu..." : "Lưu bài"}</span>
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-md text-xs sm:text-sm font-bold transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            <span>{submitting ? "Đang nộp..." : "Nộp bài"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator;

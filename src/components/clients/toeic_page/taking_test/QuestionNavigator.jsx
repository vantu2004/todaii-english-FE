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
  answers, // object: { questionId: 'A'|'B'|'C'|'D' }
  marks, // Set<questionId>
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

  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const markedCount = questions.filter((q) => marks.has(q.id)).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-3">
          <Map size={16} className="text-neutral-500 dark:text-neutral-400" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Bản đồ câu hỏi
          </h3>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedByPart).map(([partId, partQuestions]) => {
          const partInfo = PARTS.find((p) => p.id === Number(partId));
          return (
            <div key={partId}>
              <h4 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                {partInfo?.name || `Part ${partId}`}
              </h4>
              <div className="grid grid-cols-6 gap-1.5">
                {partQuestions.map((q) => {
                  const isAnswered = !!answers[q.id];
                  const isMarkd = marks.has(q.id);

                  let btnClass =
                    "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400";
                  if (isMarkd) {
                    btnClass = "bg-amber-500 text-white shadow-sm";
                  } else if (isAnswered) {
                    btnClass = "bg-brand-500 text-white shadow-sm";
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onNavigateToQuestion(q.id)}
                      className={`w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all hover:scale-105 ${btnClass}`}
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
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-wrap gap-3 mb-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
            <span>Chưa làm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-brand-500" />
            <span>Đã làm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span>Đánh dấu</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? "Đang lưu..." : "Lưu bài"}</span>
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shadow-sm"
          >
            <Send size={16} />
            <span>{submitting ? "Đang nộp..." : "Nộp bài"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator;

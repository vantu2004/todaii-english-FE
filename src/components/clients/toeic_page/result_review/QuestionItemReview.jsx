import React, { forwardRef } from "react";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  BookmarkCheck,
} from "lucide-react";

const getImages = (urlStr) => {
  if (!urlStr) return [];
  return urlStr
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
};

// ─── Option style theo so sánh user_choice vs correct_ans ────────────────────
const getOptionStyle = (opt, userChoice, correctAns) => {
  const isCorrect = opt === correctAns;
  const isUserChoice = opt === userChoice;

  if (isCorrect && isUserChoice) {
    // Chọn đúng
    return {
      container: "border-green-500 bg-green-50 dark:bg-green-900/20",
      letter: "text-green-700 dark:text-green-400 font-bold",
      text: "text-green-700 dark:text-green-300",
      icon: <CheckCircle2 size={14} className="text-green-500 shrink-0" />,
    };
  }
  if (isUserChoice && !isCorrect) {
    // User chọn sai
    return {
      container: "border-red-400 bg-red-50 dark:bg-red-900/20",
      letter: "text-red-600 dark:text-red-400 font-bold",
      text: "text-red-600 dark:text-red-300",
      icon: <XCircle size={14} className="text-red-500 shrink-0" />,
    };
  }
  if (isCorrect && userChoice && userChoice !== correctAns) {
    // Đáp án đúng nhưng user không chọn
    return {
      container: "border-green-400 bg-green-50/50 dark:bg-green-900/10",
      letter: "text-green-600 dark:text-green-500 font-bold",
      text: "text-green-600 dark:text-green-400",
      icon: <CheckCircle2 size={14} className="text-green-400 shrink-0" />,
    };
  }
  // Neutral
  return {
    container: "border-neutral-200 dark:border-neutral-700",
    letter: "text-neutral-500 dark:text-neutral-400",
    text: "text-neutral-500 dark:text-neutral-500",
    icon: null,
  };
};

// ─── Badge kết quả: dùng status từ BE (1=đúng, 0=sai, 2=bỏ qua) ─────────────
const ResultBadge = ({ status }) => {
  if (status === 1) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
        <CheckCircle2 size={11} /> Đúng
      </span>
    );
  }
  if (status === 0) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
        <XCircle size={11} /> Sai
      </span>
    );
  }
  // status === 2: bỏ qua
  return (
    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500">
      <MinusCircle size={11} /> Bỏ qua
    </span>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const QuestionItemReview = forwardRef(
  (
    {
      question, // ToeicQuestionDTO
      questionNumber,
      userChoice, // "A"|"B"|"C"|"D"|null — từ ToeicUserAnswerDTO.user_choice
      correctAns, // "A"|"B"|"C"|"D" — từ ToeicQuestionDTO.correct_ans (merge ở hook)
      isMarked, // boolean — từ ToeicUserAnswerDTO.is_marked
      status, // number — 1=đúng, 0=sai, 2=bỏ qua — từ ToeicUserAnswerDTO.status
      optionCount = 4,
      partNumber,
    },
    ref,
  ) => {
    const options = optionCount === 3 ? ["A", "B", "C"] : ["A", "B", "C", "D"];
    const resolvedPart = partNumber || question.part_number;
    const showAudio = question.audio_url && ![5, 6, 7].includes(resolvedPart);
    const hasMedia = question.image_url || showAudio;

    // Border màu card theo kết quả
    const cardBorder =
      status === 1
        ? "border-green-200 dark:border-green-900/40"
        : status === 0
          ? "border-red-200 dark:border-red-900/40"
          : "border-neutral-200 dark:border-neutral-800";

    return (
      <div
        ref={ref}
        id={`question-${question.id}`}
        className={`mb-3 p-3 bg-white dark:bg-neutral-900 rounded-lg border transition-colors ${cardBorder}`}
      >
        <div
          className={
            hasMedia ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-2.5"
          }
        >
          {/* Media Column */}
          {hasMedia && (
            <div className="flex flex-col gap-2 justify-center min-w-0">
              {getImages(question.image_url).map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`Câu ${questionNumber}`}
                  className="w-full rounded-lg object-contain border border-neutral-100 dark:border-neutral-800"
                />
              ))}
              {showAudio && (
                <audio controls className="w-full" src={question.audio_url} />
              )}
            </div>
          )}

          {/* Text/Options Column */}
          <div className="space-y-2.5 min-w-0">
            {/* Header: số câu + badge + bookmark */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <div className="w-6 h-6 shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-md flex items-center justify-center font-bold text-xs text-neutral-700 dark:text-neutral-300">
                  {questionNumber}
                </div>
                <div className="flex-1 min-w-0">
                  {question.question && (
                    <p
                      className="text-neutral-900 dark:text-white font-medium text-sm sm:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: question.question }}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <ResultBadge status={status} />
                {isMarked && (
                  <BookmarkCheck
                    size={14}
                    className="text-amber-500"
                    title="Đã đánh dấu"
                  />
                )}
              </div>
            </div>

            {/* Options */}
            <div className={`space-y-1.5 ${hasMedia ? "ml-0" : "ml-8"}`}>
              {options.map((opt) => {
                const optionText = question[`option_${opt.toLowerCase()}`];
                const style = getOptionStyle(opt, userChoice, correctAns);
                return (
                  <div
                    key={opt}
                    className={`flex items-center gap-2 py-1.5 px-2.5 rounded-md border text-xs sm:text-sm ${style.container}`}
                  >
                    {/* Icon hoặc letter */}
                    {style.icon ? (
                      <>
                        {style.icon}
                        <span
                          className={`font-semibold w-4 shrink-0 ${style.letter}`}
                        >
                          {opt}.
                        </span>
                      </>
                    ) : (
                      <span
                        className={`font-semibold w-4 shrink-0 ${style.letter}`}
                      >
                        {opt}.
                      </span>
                    )}
                    {optionText && (
                      <span className={style.text}>{optionText}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Transcript nếu có (Part 1-4) */}
            {question.transcript && (
              <div className="ml-8 mt-2 p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Transcript
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {question.transcript}
                </p>
              </div>
            )}

            {/* Explanation nếu có */}
            {question.explanation && (
              <div className="ml-8 mt-1 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40">
                <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-1">
                  Giải thích
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

QuestionItemReview.displayName = "QuestionItemReview";
export default QuestionItemReview;

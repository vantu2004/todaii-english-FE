import React from "react";
import QuestionItemReview from "./QuestionItemReview";

const getImages = (urlStr) => {
  if (!urlStr) return [];
  return urlStr
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
};

// answers shape: { [qId]: { user_choice, correct_ans, is_marked, status } }
const PassageGroupReview = ({
  passage, // ToeicPassageDTO
  questions, // ToeicQuestionDTO[] — questions trong passage
  startNumber,
  answers,
  questionRefs,
  partNumber,
}) => {
  const images = getImages(passage.image_url);
  const hasImages = images.length > 0;
  const showAudio = passage.audio_url && ![6, 7].includes(partNumber);

  let showText = false;
  if ([6, 7].includes(partNumber)) {
    showText = !hasImages && !!passage.passage_text;
  } else if (![3, 4].includes(partNumber)) {
    showText = !!passage.passage_text;
  }

  const hasMedia = hasImages || showAudio || showText;

  // Đếm đúng trong group — dựa vào status (1=đúng)
  const correctInGroup = questions.filter(
    (q) => answers[q.id]?.status === 1,
  ).length;

  return (
    <div className="mb-3">
      {/* Header */}
      <div className="mb-1.5 px-1 flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          Câu {startNumber}
          {questions.length > 1
            ? ` – ${startNumber + questions.length - 1}`
            : ""}
        </span>
        <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500">
          {correctInGroup}/{questions.length} đúng
        </span>
      </div>

      <div
        className={
          hasMedia ? "grid grid-cols-1 lg:grid-cols-2 gap-3" : "space-y-2.5"
        }
      >
        {/* Passage media — sticky trên desktop */}
        {hasMedia && (
          <div className="space-y-2 w-full min-w-0 lg:sticky lg:top-4 self-start">
            {images.map((imgUrl, i) => (
              <img
                key={i}
                src={imgUrl}
                alt="Passage"
                className="w-full rounded-lg object-contain border border-neutral-100 dark:border-neutral-800"
              />
            ))}
            {showAudio && (
              <audio controls className="w-full" src={passage.audio_url} />
            )}
            {showText && (
              <>
                <div
                  className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: passage.passage_text }}
                />
                {/* Dịch passage nếu có */}
                {passage.passage_trans && (
                  <details className="mt-1">
                    <summary className="text-xs font-semibold text-neutral-400 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300 select-none">
                      Xem bản dịch
                    </summary>
                    <div
                      className="mt-1.5 prose dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: passage.passage_trans,
                      }}
                    />
                  </details>
                )}
              </>
            )}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-2.5 min-w-0">
          {questions.map((q, qIndex) => {
            const ans = answers[q.id] || {};
            return (
              <QuestionItemReview
                key={q.id}
                ref={(el) => {
                  if (questionRefs) questionRefs.current[q.id] = el;
                }}
                question={q}
                questionNumber={startNumber + qIndex}
                userChoice={ans.user_choice ?? null}
                correctAns={ans.correct_ans ?? null}
                isMarked={ans.is_marked ?? false}
                status={ans.status ?? 2}
                optionCount={4}
                partNumber={partNumber}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PassageGroupReview;

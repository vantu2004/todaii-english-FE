import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import QuestionItemReview from "./QuestionItemReview";

const getImages = (urlStr) => {
  if (!urlStr) return [];
  return urlStr
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
};

const PassageGroupReview = ({
  passage,
  questions,
  startNumber,
  answers,
  questionRefs,
  partNumber,
}) => {
  // State để quản lý ẩn/hiện text và dịch của passage
  const [isPassageOpen, setIsPassageOpen] = useState(false);
  const [isTransOpen, setIsTransOpen] = useState(false);

  const images = getImages(passage.image_url);
  const hasImages = images.length > 0;

  // Logic hiển thị media: Part 3, 4, 6, 7 luôn ưu tiên hiện ảnh/audio
  const showAudio = passage.audio_url && ![6, 7].includes(partNumber);
  const hasMedia = hasImages || showAudio || !!passage.passage_text;

  const correctInGroup = questions.filter(
    (q) => answers[q.id]?.status === 1,
  ).length;

  return (
    <div className="mb-6 p-4 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-xl border border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <div className="mb-3 px-1 flex items-center justify-between">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Passage media & Text */}
        <div className="space-y-3 w-full min-w-0 self-start">
          {images.map((imgUrl, i) => (
            <img
              key={i}
              src={imgUrl}
              alt="Passage"
              className="w-full rounded-lg object-contain border border-neutral-200 dark:border-neutral-800"
            />
          ))}
          {showAudio && (
            <audio controls className="w-full" src={passage.audio_url} />
          )}

          {/* Passage Text Toggle */}
          {passage.passage_text && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <button
                onClick={() => setIsPassageOpen(!isPassageOpen)}
                className="flex items-center justify-between w-full p-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-700"
              >
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  Nội dung bài đọc
                </span>
                {isPassageOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
              {isPassageOpen && (
                <div
                  className="p-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: passage.passage_text }}
                />
              )}
            </div>
          )}

          {/* Translation Toggle */}
          {passage.passage_trans && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <button
                onClick={() => setIsTransOpen(!isTransOpen)}
                className="flex items-center justify-between w-full p-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-700"
              >
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                  Bản dịch
                </span>
                {isTransOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
              {isTransOpen && (
                <div
                  className="p-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: passage.passage_trans }}
                />
              )}
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-3 min-w-0">
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

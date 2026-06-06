import React from "react";
import QuestionItem from "./QuestionItem";

const getImages = (urlStr) => {
  if (!urlStr) return [];
  return urlStr
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
};

const PassageGroup = ({
  passage,
  questions,
  startNumber,
  answers,
  onSelectAnswer,
  onToggleMark,
  optionCount = 4,
  questionRefs,
  partNumber,
  mode,
}) => {
  const images = getImages(passage.image_url || passage.imageUrl);
  const hasImages = images.length > 0;
  const showAudio =
    (passage.audio_url || passage.audioUrl) &&
    mode !== "FULL_TEST" &&
    ![6, 7].includes(partNumber);

  // Prioritize images over text for parts 6 and 7; hide text entirely for parts 3 and 4.
  let showText = false;
  if ([6, 7].includes(partNumber)) {
    showText = !hasImages && !!passage.passage_text;
  } else if (![3, 4].includes(partNumber)) {
    showText = !!passage.passage_text;
  }

  const hasMedia = hasImages || showAudio || showText;

  const renderMediaColumn = () => {
    return (
      <div className="space-y-3 w-full min-w-0">
        {images.map((imgUrl, i) => (
          <img
            key={i}
            src={imgUrl}
            alt="Passage Illustration"
            className="w-full rounded-xl object-contain border border-neutral-100 dark:border-neutral-800"
          />
        ))}
        {showAudio && (
          <audio
            controls
            className="w-full"
            src={passage.audio_url || passage.audioUrl}
          />
        )}
        {showText && (
          <div
            className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: passage.passage_text }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="mb-4">
      {/* Passage Header */}
      <div className="mb-1.5 px-1 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
        Câu {startNumber}
        {questions.length > 1 ? ` – ${startNumber + questions.length - 1}` : ""}
      </div>

      <div
        className={
          hasMedia ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : "space-y-3"
        }
      >
        {/* Left column: Passage Media (sticky) */}
        {hasMedia && renderMediaColumn()}

        {/* Right column: Questions list */}
        <div className="space-y-3 min-w-0">
          {questions.map((q, qIndex) => (
            <QuestionItem
              key={q.id}
              ref={(el) => {
                if (questionRefs) questionRefs.current[q.id] = el;
              }}
              question={q}
              questionNumber={startNumber + qIndex}
              selectedAnswer={answers[q.id]?.user_choice || null}
              isMarked={answers[q.id]?.is_marked || false}
              onSelectAnswer={onSelectAnswer}
              onToggleMark={onToggleMark}
              optionCount={optionCount}
              mode={mode}
              partNumber={partNumber}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassageGroup;

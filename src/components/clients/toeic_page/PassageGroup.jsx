import React from "react";
import QuestionItem from "@/components/clients/toeic_page/QuestionItem";

const PassageGroup = ({
  passage,
  questions,
  startNumber,
  answers,
  marks,
  onSelectAnswer,
  onToggleMark,
  optionCount = 4,
  questionRefs,
}) => {
  return (
    <div className="mb-10">
      {/* Passage content */}
      <div className="mb-6 p-5 sm:p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
        <h3 className="font-bold mb-4 text-neutral-900 dark:text-white text-sm uppercase tracking-wider">
          Câu {startNumber}
          {questions.length > 1
            ? ` – ${startNumber + questions.length - 1}`
            : ""}
        </h3>

        {/* Passage image */}
        {passage.image_url && (
          <img
            src={passage.image_url}
            alt="Passage image"
            className="max-w-full rounded-xl mb-4"
          />
        )}

        {/* Passage audio */}
        {passage.audio_url && (
          <audio controls className="w-full mb-4" src={passage.audio_url} />
        )}

        {/* Passage text */}
        {passage.passage_text && (
          <div
            className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 text-sm sm:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: passage.passage_text }}
          />
        )}
      </div>

      {/* Questions belonging to this passage */}
      <div className="pl-0 lg:pl-6 border-l-0 lg:border-l-2 border-neutral-100 dark:border-neutral-800">
        {questions.map((q, qIndex) => (
          <QuestionItem
            key={q.id}
            ref={(el) => {
              if (questionRefs) questionRefs.current[q.id] = el;
            }}
            question={q}
            questionNumber={startNumber + qIndex}
            selectedAnswer={answers[q.id] || null}
            isMarked={marks.has(q.id)}
            onSelectAnswer={onSelectAnswer}
            onToggleMark={onToggleMark}
            optionCount={optionCount}
          />
        ))}
      </div>
    </div>
  );
};

export default PassageGroup;

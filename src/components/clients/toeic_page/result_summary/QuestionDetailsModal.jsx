import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";

const getImages = (urlStr) => {
  if (!urlStr) return [];
  return urlStr
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
};

const QuestionDetailsModal = ({
  isOpen,
  onClose,
  question,
  passage,
  questionNumber,
  userAnswer, // { status, user_choice }
}) => {
  if (!isOpen || !question) return null;

  const [showPassage, setShowPassage] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset toggles when question changes
  useEffect(() => {
    setShowPassage(false);
    setShowExplanation(false);
  }, [question?.id]);

  const userChoice = userAnswer?.user_choice || null;
  const correctAns = (
    question.correct_ans ||
    question.correctAns ||
    "A"
  ).toUpperCase();

  const options = ["A", "B", "C", "D"];
  const optionLetters = ["a", "b", "c", "d"];

  // Normalize part number and fields
  const partNumber = question.part_number || question.partNumber || 1;

  const qImageUrl = question.image_url || question.imageUrl;
  const qAudioUrl = question.audio_url || question.audioUrl;
  const showAudio = qAudioUrl && ![5, 6, 7].includes(partNumber);
  const images = getImages(qImageUrl);

  // Passage normalization
  const hasPassage = !!passage;
  const pImageUrl = passage ? passage.image_url || passage.imageUrl : null;
  const pAudioUrl = passage ? passage.audio_url || passage.audioUrl : null;
  const pText = passage ? passage.passage_text || passage.passageText : null;
  const pTrans = passage ? passage.passage_trans || passage.passageTrans : null;

  const passageImages = hasPassage ? getImages(pImageUrl) : [];
  const showPassageAudio =
    hasPassage && pAudioUrl && ![6, 7].includes(partNumber);
  const showPassageText = hasPassage && !!pText;

  const hasExplanation = !!question.explanation || !!question.transcript;

  return (
    <div className="fixed inset-0 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-lg w-full max-w-6xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden relative flex flex-col max-h-[95vh] animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-3.5 py-2 border-b border-neutral-200 dark:border-neutral-900 shrink-0 bg-neutral-100 dark:bg-neutral-800">
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
            Chi tiết câu hỏi {questionNumber} (Part {partNumber})
          </span>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-white rounded transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content body */}
        <div className="p-3.5 overflow-y-auto flex-1">
          <div
            className={
              hasPassage
                ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
                : "space-y-3"
            }
          >
            {/* Passage Column (Part 3, 4, 6, 7) */}
            {hasPassage && (
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-md p-2.5 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-3 md:h-full md:max-h-[75vh] md:overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-1.5 shrink-0">
                  <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-500 uppercase tracking-wider block">
                    Đoạn văn / Bài đọc (Passage)
                  </span>
                  {showPassageText && (
                    <button
                      onClick={() => setShowPassage(!showPassage)}
                      className="text-[10px] font-bold text-brand-700 dark:text-brand-400 hover:underline cursor-pointer"
                    >
                      {showPassage ? "Ẩn văn bản" : "Hiện văn bản & dịch"}
                    </button>
                  )}
                </div>

                {/* Passage Images (Always visible) */}
                {passageImages.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt="Passage Illustration"
                    className="w-full rounded border border-neutral-200 dark:border-neutral-800 max-h-[260px] object-contain bg-white dark:bg-neutral-950"
                  />
                ))}

                {/* Passage Audio (Always visible) */}
                {showPassageAudio && (
                  <audio controls className="w-full h-8" src={pAudioUrl} />
                )}

                {/* Passage Text (Only visible when showPassage is true) */}
                {showPassage && showPassageText && (
                  <div
                    className="prose dark:prose-invert max-w-none text-neutral-900 dark:text-neutral-200 text-xs leading-relaxed whitespace-pre-wrap break-words animate-fade-in"
                    dangerouslySetInnerHTML={{ __html: pText }}
                  />
                )}

                {/* Passage Translation (Only visible when showPassage is true) */}
                {showPassage && pTrans && (
                  <div className="space-y-1 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 animate-fade-in">
                    <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">
                      Bản dịch đoạn văn (Translation):
                    </span>
                    <div
                      className="text-neutral-800 dark:text-neutral-300 text-xs leading-relaxed whitespace-pre-wrap break-words font-medium"
                      dangerouslySetInnerHTML={{ __html: pTrans }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Question, Options and Explanation Column */}
            <div
              className={`space-y-3.5 md:overflow-y-auto md:pr-1 ${hasPassage ? "md:max-h-[75vh]" : ""}`}
            >
              {/* Question Text */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 shrink-0 bg-brand-500 text-white rounded flex items-center justify-center font-bold text-[10px]">
                  {questionNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-neutral-900 dark:text-white font-bold text-xs leading-normal"
                    dangerouslySetInnerHTML={{
                      __html:
                        question.question ||
                        "Chọn đáp án đúng nhất để hoàn thành câu.",
                    }}
                  />
                </div>
              </div>

              {/* Question Media (Part 1, 3, 4, 6, 7 if present) */}
              {images.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`Câu ${questionNumber}`}
                  className="w-full rounded border border-neutral-200 dark:border-neutral-800 max-h-[200px] object-contain bg-white dark:bg-neutral-950"
                />
              ))}
              {showAudio && (
                <audio
                  controls
                  className="w-full h-8 animate-fade-in"
                  src={qAudioUrl}
                />
              )}

              {/* Options List */}
              <div className="grid grid-cols-1 gap-1.5 pl-7.5">
                {options.map((opt, index) => {
                  const optText =
                    question[`option_${optionLetters[index]}`] ||
                    question[`option${opt}`];
                  const isCorrect = opt === correctAns;
                  const isUserSelected = opt === userChoice;

                  // Skip D for Part 2 if not present
                  if (
                    opt === "D" &&
                    (!optText || optText === "<None>" || partNumber === 2)
                  )
                    return null;

                  let optionStyle =
                    "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200";
                  let iconComponent = null;

                  if (showExplanation) {
                    if (isCorrect) {
                      optionStyle =
                        "border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 font-bold";
                      iconComponent = (
                        <Check
                          size={13}
                          className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold"
                        />
                      );
                    } else if (isUserSelected) {
                      optionStyle =
                        "border-2 border-rose-600 bg-rose-50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-400 font-bold";
                      iconComponent = (
                        <X
                          size={13}
                          className="text-rose-600 dark:text-rose-400 shrink-0 font-bold"
                        />
                      );
                    }
                  } else {
                    if (isUserSelected) {
                      // Highlight user selected answer without showing correctness
                      optionStyle =
                        "border-2 border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 text-brand-900 dark:text-brand-300 font-bold";
                    }
                  }

                  return (
                    <div
                      key={opt}
                      className={`flex items-center justify-between gap-2 py-1.5 px-2.5 rounded border text-xs ${optionStyle}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-500 dark:text-neutral-400">
                          {opt}.
                        </span>
                        <span>{optText || `Option ${opt}`}</span>
                      </div>
                      {iconComponent}
                    </div>
                  );
                })}
              </div>

              {/* Explanation & Transcript Section */}
              {hasExplanation &&
                (showExplanation ? (
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-md p-2 bg-neutral-50/30 dark:bg-neutral-900/20 space-y-2.5 overflow-x-hidden animate-fade-in">
                    <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 dark:text-neutral-500 uppercase tracking-wider">
                        <AlertCircle size={12} className="text-neutral-400" />
                        <span>Giải thích chi tiết & Transcript</span>
                      </div>
                      <button
                        onClick={() => setShowExplanation(false)}
                        className="text-[10px] font-bold text-rose-600 dark:text-rose-500 hover:underline cursor-pointer"
                      >
                        Ẩn giải thích
                      </button>
                    </div>

                    {question.transcript && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">
                          Transcript / Lời thoại:
                        </span>
                        <div
                          className="text-[11px] text-neutral-900 dark:text-neutral-300 leading-relaxed font-medium break-words whitespace-normal overflow-x-hidden [&_*]:whitespace-normal [&_*]:break-words"
                          dangerouslySetInnerHTML={{
                            __html: question.transcript,
                          }}
                        />
                      </div>
                    )}

                    {question.explanation && (
                      <div className="space-y-1 pt-2.5 border-t border-neutral-200/50 dark:border-neutral-800/50">
                        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">
                          Giải thích đáp án:
                        </span>
                        <div
                          className="text-[11px] text-neutral-900 dark:text-neutral-300 leading-relaxed font-medium break-words whitespace-normal overflow-x-hidden [&_*]:whitespace-normal [&_*]:break-words"
                          dangerouslySetInnerHTML={{
                            __html: question.explanation,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center py-0.5">
                    <button
                      onClick={() => setShowExplanation(true)}
                      className="px-3 py-1.5 border border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-400 rounded-md text-xs font-bold hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-all cursor-pointer w-full text-center"
                    >
                      Xem giải thích chi tiết & transcript
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3.5 py-2 border-t border-neutral-200 dark:border-neutral-900 flex justify-end shrink-0 bg-neutral-100 dark:bg-neutral-800">
          <button
            onClick={onClose}
            className="bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-md px-3.5 py-1 text-xs font-bold cursor-pointer transition-all border border-neutral-950 dark:border-white"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailsModal;

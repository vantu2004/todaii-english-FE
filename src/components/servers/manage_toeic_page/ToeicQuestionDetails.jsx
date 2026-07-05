import DOMPurify from "dompurify";
import { formatISODate } from "@/utils/FormatDate";

const ToeicQuestionDetails = ({ question, partNumber }) => {
  const imageUrl =
    question.imageUrl ||
    question.image_url ||
    question.image_request?.uploaded_image ||
    question.image_request?.image_url;
  const audioUrl =
    question.audioUrl ||
    question.audio_url ||
    question.audio_request?.uploaded_audio ||
    question.audio_request?.audio_url;
  const correctAns = question.correct_ans || question.correctAns;
  const createdTime = question.created_at || question.createdAt;
  const passageId = question.passage_id || question.passageId;
  const currentPartNum =
    question.part_number || question.partNumber || partNumber;

  const displayVal = (val) => {
    if (val === null || val === undefined || val === "")
      return <span className="text-gray-400 italic font-normal">null</span>;
    return val;
  };

  const proseClass =
    "prose prose-sm dark:prose-invert min-w-0 max-w-none break-words overflow-x-auto text-sm text-gray-800 dark:text-gray-200 min-h-[40px] leading-relaxed border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-800/50";

  return (
    <div className="space-y-6 min-w-0">
      {/* Metadata Grid */}
      <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
          Question Metadata
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs font-medium text-gray-500">
              Question ID
            </span>
            <p className="font-mono font-medium text-gray-900 dark:text-white mt-1">
              #{displayVal(question.id)}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500">
              Part Number
            </span>
            <p className="font-medium text-gray-900 dark:text-white mt-1">
              Part {displayVal(currentPartNum)}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500">
              Passage ID
            </span>
            <p className="font-mono font-medium text-gray-900 dark:text-white mt-1">
              {passageId ? (
                `#${passageId}`
              ) : (
                <span className="text-gray-400 italic font-normal">null</span>
              )}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500">
              Correct Answer
            </span>
            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-800">
                {displayVal(correctAns)}
              </span>
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="text-xs font-medium text-gray-500">
              Created At
            </span>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              {createdTime ? (
                formatISODate(createdTime)
              ) : (
                <span className="text-gray-400 italic">null</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Media Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image URL Field */}
        <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-lg bg-white dark:bg-gray-900 space-y-3">
          <span className="text-xs font-medium text-gray-500 block">
            Image URL
          </span>
          <p
            className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate max-w-full"
            title={imageUrl || ""}
          >
            {imageUrl ? (
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:underline hover:text-gray-900 dark:hover:text-white"
              >
                {imageUrl}
              </a>
            ) : (
              <span className="text-gray-400 italic">null</span>
            )}
          </p>
          {imageUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center max-h-48 mt-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-contain max-h-40"
              />
            </div>
          )}
        </div>

        {/* Audio URL Field */}
        <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-lg bg-white dark:bg-gray-900 space-y-3">
          <span className="text-xs font-medium text-gray-500 block">
            Audio URL
          </span>
          <p
            className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate max-w-full"
            title={audioUrl || ""}
          >
            {audioUrl ? (
              <a
                href={audioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:underline hover:text-gray-900 dark:hover:text-white"
              >
                {audioUrl}
              </a>
            ) : (
              <span className="text-gray-400 italic">null</span>
            )}
          </p>
          {audioUrl && (
            <div className="mt-2">
              <audio controls className="w-full" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-900">
        <span className="text-xs font-medium text-gray-500 block mb-3">
          Question Text
        </span>
        <div
          className={proseClass}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              question.question ||
                "<span class='text-gray-400 italic'>null</span>",
            ),
          }}
        />
      </div>

      {/* Options Selection */}
      <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-900 space-y-4">
        <span className="text-xs font-medium text-gray-500 block">
          Options List
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((opt) => {
            const isCorrect = correctAns === opt;
            const optionText =
              opt === "A"
                ? question.option_a || question.optionA
                : opt === "B"
                  ? question.option_b || question.optionB
                  : opt === "C"
                    ? question.option_c || question.optionC
                    : question.option_d || question.optionD;

            return (
              <div
                key={opt}
                className={`p-4 rounded-lg border transition-all ${
                  isCorrect
                    ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-900 dark:text-green-100 font-medium"
                    : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="text-xs font-medium uppercase tracking-wider block mb-1 text-gray-500 dark:text-gray-400">
                  Option {opt}
                </span>
                <p className="text-sm break-words">{displayVal(optionText)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transcript */}
      <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-900">
        <span className="text-xs font-medium text-gray-500 block mb-3">
          Transcript
        </span>
        <div
          className={proseClass}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              question.transcript ||
                "<span class='text-gray-400 italic'>null</span>",
            ),
          }}
        />
      </div>

      {/* Explanation */}
      <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-900">
        <span className="text-xs font-medium text-gray-500 block mb-3">
          Explanation
        </span>
        <div
          className={proseClass}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              question.explanation ||
                "<span class='text-gray-400 italic'>null</span>",
            ),
          }}
        />
      </div>

      {/* Tags */}
      {question.tags?.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2.5 py-0.5 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-700"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToeicQuestionDetails;

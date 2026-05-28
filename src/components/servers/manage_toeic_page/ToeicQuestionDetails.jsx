import {
  Image as ImageIcon,
  FileAudio,
  FileText,
  CheckSquare,
  Tags,
} from "lucide-react";
import DOMPurify from "dompurify";

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

  const isPart12 = partNumber === 1 || partNumber === 2;
  const correctAns = question.correct_ans || question.correctAns;

  const getOptionClass = (optionLetter) => {
    if (correctAns === optionLetter) {
      return "border-2 border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200 font-bold";
    }
    return "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  };

  return (
    <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
      {/* Media Row for Part 1/2 */}
      {(imageUrl || audioUrl) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {imageUrl && (
            <div className="rounded-xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 bg-gray-50 flex items-center justify-center max-h-64">
              <img
                src={imageUrl}
                alt="Question Illustration"
                className="w-full h-full object-contain max-h-60"
              />
            </div>
          )}
          {audioUrl && (
            <div className="flex flex-col justify-center bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-xl border border-purple-200/50 shadow-sm gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-purple-100/50 rounded-lg">
                  <FileAudio size={20} className="text-purple-600" />
                </div>
                <span className="text-sm font-bold text-purple-800 uppercase tracking-wide">
                  Question Audio
                </span>
              </div>
              <audio controls className="w-full" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}

      {/* Main Question Text/Transcript */}
      <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-gray-800 dark:to-gray-750 p-6 rounded-2xl border border-blue-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-blue-200/50 dark:border-gray-600 pb-2">
          <div className="p-1.5 bg-blue-100/50 rounded-lg">
            <FileText size={16} className="text-blue-600" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            {isPart12 ? "Transcript" : "Question"}
          </h4>
        </div>
        <div
          className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 min-h-[40px] leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              isPart12
                ? question.transcript || "No transcript provided."
                : question.question || "No question provided.",
            ),
          }}
        />
      </div>

      {/* Options Selection (Only for parts 3-7) */}
      {!isPart12 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-xl shadow-sm transition-all ${getOptionClass("A")}`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block mb-1">
              Option A
            </span>
            <p className="text-sm">
              {question.option_a || question.optionA || "N/A"}
            </p>
          </div>
          <div
            className={`p-4 rounded-xl shadow-sm transition-all ${getOptionClass("B")}`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block mb-1">
              Option B
            </span>
            <p className="text-sm">
              {question.option_b || question.optionB || "N/A"}
            </p>
          </div>
          <div
            className={`p-4 rounded-xl shadow-sm transition-all ${getOptionClass("C")}`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block mb-1">
              Option C
            </span>
            <p className="text-sm">
              {question.option_c || question.optionC || "N/A"}
            </p>
          </div>
          <div
            className={`p-4 rounded-xl shadow-sm transition-all ${getOptionClass("D")}`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block mb-1">
              Option D
            </span>
            <p className="text-sm">
              {question.option_d || question.optionD || "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Correct Answer Badge */}
      <div className="flex items-center gap-3 bg-green-50/50 dark:bg-green-900/10 p-4 rounded-xl border border-green-200/50">
        <CheckSquare className="text-green-600" size={20} />
        <div>
          <span className="text-xs text-gray-500 font-medium block">
            Correct Answer
          </span>
          <span className="text-lg font-bold text-green-700 dark:text-green-400">
            {correctAns}
          </span>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-750 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
          <div className="p-1.5 bg-gray-200 rounded-lg">
            <FileText size={16} className="text-gray-600" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
            Explanation
          </h4>
        </div>
        <div
          className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 min-h-[50px] leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              question.explanation || "No explanation provided.",
            ),
          }}
        />
      </div>

      {/* Tags Badges */}
      <div className="flex items-center gap-3 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200/50">
        <Tags className="text-blue-600 shrink-0" size={20} />
        <div className="flex flex-wrap gap-2">
          {question.tags?.length > 0 ? (
            question.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold"
              >
                {tag.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500 italic">
              No tags selected.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToeicQuestionDetails;

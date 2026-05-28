import { Image as ImageIcon, FileAudio, FileText, CheckSquare, Tags, Info, Calendar } from "lucide-react";
import DOMPurify from "dompurify";
import { formatISODate } from "@/utils/FormatDate";

const ToeicQuestionDetails = ({ question, partNumber }) => {
  const imageUrl = question.imageUrl || question.image_url || question.image_request?.uploaded_image || question.image_request?.image_url;
  const audioUrl = question.audioUrl || question.audio_url || question.audio_request?.uploaded_audio || question.audio_request?.audio_url;
  const correctAns = question.correct_ans || question.correctAns;
  const createdTime = question.created_at || question.createdAt;
  const passageId = question.passage_id || question.passageId;
  const currentPartNum = question.part_number || question.partNumber || partNumber;

  const displayVal = (val) => {
    if (val === null || val === undefined || val === "") return <span className="text-gray-400 italic font-normal">null</span>;
    return val;
  };

  return (
    <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
      {/* Metadata Grid */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-750 p-6 rounded-2xl border border-indigo-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-indigo-200/50 pb-2">
          <Info size={16} /> Question Metadata
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Question ID</span>
            <p className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-1">#{displayVal(question.id)}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Part Number</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 mt-1">Part {displayVal(currentPartNum)}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Passage ID</span>
            <p className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-1">
              {passageId ? `#${passageId}` : <span className="text-gray-400 italic font-normal">null</span>}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Correct Answer</span>
            <p className="font-bold text-green-700 dark:text-green-400 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-green-100 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                {displayVal(correctAns)}
              </span>
            </p>
          </div>
          <div className="md:col-span-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Created At</span>
            <p className="text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" />
              {createdTime ? formatISODate(createdTime) : <span className="text-gray-400 italic">null</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Media Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image URL Field */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <ImageIcon size={14} /> Image URL
          </span>
          <p className="text-xs text-gray-500 font-mono truncate max-w-full" title={imageUrl || ""}>
            {imageUrl ? (
              <a href={imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                {imageUrl}
              </a>
            ) : (
              <span className="text-gray-400 italic">null</span>
            )}
          </p>
          {imageUrl && (
            <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center max-h-48 mt-2">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-contain max-h-40" />
            </div>
          )}
        </div>

        {/* Audio URL Field */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            <FileAudio size={14} /> Audio URL
          </span>
          <p className="text-xs text-gray-500 font-mono truncate max-w-full" title={audioUrl || ""}>
            {audioUrl ? (
              <a href={audioUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2 mb-3">
          <FileText size={14} /> Question Text
        </span>
        <div
          className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 min-h-[40px] leading-relaxed border border-gray-150 p-4 rounded-xl bg-gray-50/50"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(question.question || "<span class='text-gray-400 italic'>null</span>"),
          }}
        />
      </div>

      {/* Options Selection */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">Options List</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl shadow-sm border transition-all ${correctAns === "A" ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 font-bold" : "border-gray-200"}`}>
            <span className="text-xs font-bold uppercase tracking-wider block mb-1">Option A</span>
            <p className="text-sm">{displayVal(question.option_a || question.optionA)}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-sm border transition-all ${correctAns === "B" ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 font-bold" : "border-gray-200"}`}>
            <span className="text-xs font-bold uppercase tracking-wider block mb-1">Option B</span>
            <p className="text-sm">{displayVal(question.option_b || question.optionB)}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-sm border transition-all ${correctAns === "C" ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 font-bold" : "border-gray-200"}`}>
            <span className="text-xs font-bold uppercase tracking-wider block mb-1">Option C</span>
            <p className="text-sm">{displayVal(question.option_c || question.optionC)}</p>
          </div>
          <div className={`p-4 rounded-xl shadow-sm border transition-all ${correctAns === "D" ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 font-bold" : "border-gray-200"}`}>
            <span className="text-xs font-bold uppercase tracking-wider block mb-1">Option D</span>
            <p className="text-sm">{displayVal(question.option_d || question.optionD)}</p>
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2 mb-3">
          <FileText size={14} /> Transcript
        </span>
        <div
          className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 min-h-[40px] leading-relaxed border border-gray-150 p-4 rounded-xl bg-gray-50/50"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(question.transcript || "<span class='text-gray-400 italic'>null</span>"),
          }}
        />
      </div>

      {/* Explanation */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2 mb-3">
          <FileText size={14} /> Explanation
        </span>
        <div
          className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 min-h-[40px] leading-relaxed border border-gray-150 p-4 rounded-xl bg-gray-50/50"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(question.explanation || "<span class='text-gray-400 italic'>null</span>"),
          }}
        />
      </div>

      {/* Tags */}
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
            <span className="text-xs text-gray-400 italic">null</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToeicQuestionDetails;

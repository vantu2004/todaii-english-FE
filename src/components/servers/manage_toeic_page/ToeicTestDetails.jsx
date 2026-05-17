import {
  Clock,
  Layers,
  FileText,
  Activity,
  Image as ImageIcon,
  FileAudio,
} from "lucide-react";
import { formatISODate } from "@/utils/FormatDate";

const ToeicTestDetails = ({ test }) => {
  const getAudioUrl = (item) => item.audio_url
    ;
  const getImageUrl = (item) => item.image_url

  const imageUrl = getImageUrl(test);
  const audioUrl = getAudioUrl(test);

  return (
    <div className="space-y-6">
      {/* === Image Preview - Full Width === */}
      <div className="rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all aspect-video max-w-4xl mx-auto bg-gray-100 flex flex-col justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={test.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400">
            <div className="text-center">
              <ImageIcon size={64} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm italic">No Image Available</p>
            </div>
          </div>
        )}
      </div>

      {/* === Audio Player === */}
      {audioUrl && (
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200/50 shadow-sm flex items-center gap-4">
          <div className="p-2 bg-blue-100/50 rounded-lg shrink-0">
            <FileAudio size={24} className="text-blue-600" />
          </div>
          <audio controls className="w-full" src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* === Title & Description === */}
      <div className="text-center px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
          {test.title}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {test.description || "No description provided."}
        </p>
      </div>

      {/* === Test Information === */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-6 border border-indigo-200/50 hover:border-indigo-300/60 hover:shadow-lg transition-all">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-100/50 rounded-lg">
            <FileText size={18} className="text-indigo-600" />
          </div>
          <h4 className="text-base font-bold text-gray-900 uppercase tracking-wide">
            Test Information
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
            <Activity
              size={18}
              className="text-indigo-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Test Type
              </p>
              <p className="text-sm font-bold text-gray-900">
                {test.test_type || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
            <Clock size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Duration
              </p>
              <p className="text-sm font-bold text-gray-900">
                {test.duration} minutes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
            <Layers
              size={18}
              className="text-indigo-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Collection
              </p>
              <p className="text-sm font-bold text-gray-900">
                {test.collection?.name || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
            <FileText
              size={18}
              className="text-indigo-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Status
              </p>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full ${test.status === "PUBLISHED"
                    ? "bg-green-100 text-green-700"
                    : test.status === "ARCHIVED"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {test.status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Meta Information === */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/60 hover:shadow-md transition-all">
          <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
            Created At
          </p>
          <p className="text-sm text-gray-900 font-semibold">
            {formatISODate(test.created_at)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/60 hover:shadow-md transition-all">
          <p className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">
            Last Updated
          </p>
          <p className="text-sm text-gray-900 font-semibold">
            {formatISODate(test.updated_at)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/60 hover:shadow-md transition-all">
          <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">
            Created By
          </p>
          <p className="text-sm text-gray-900 font-semibold truncate" title={typeof (test.created_by) === 'object' ? (test.created_by).display_name : (test.created_by || "System")}>
            {typeof (test.created_by) === 'object'
              ? ((test.created_by).display_name || (test.created_by).id)
              : (test.created_by || "System")}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/60 hover:shadow-md transition-all">
          <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Test ID
          </p>
          <p className="text-sm text-gray-900 font-mono font-bold">
            #{test.id}
          </p>
        </div>
      </div>

      {/* === Content Information === */}
      {(test.questions_count !== undefined || test.passages_count !== undefined || test.questions?.length !== undefined || test.passages?.length !== undefined) && (
        <div className="mt-6 flex justify-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700">
            <Layers size={20} />
            <span className="font-semibold">
              {test.passages_count !== undefined ? test.passages_count : (test.passages?.length || 0)} Passages
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            <FileText size={20} />
            <span className="font-semibold">
              {test.questions_count !== undefined ? test.questions_count : (test.questions?.length || 0)} Questions
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToeicTestDetails;

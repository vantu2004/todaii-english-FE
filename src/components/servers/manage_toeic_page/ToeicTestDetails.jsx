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
  const getAudioUrl = (item) => item.audio_url;
  const getImageUrl = (item) => item.image_url;

  const imageUrl = getImageUrl(test);
  const audioUrl = getAudioUrl(test);

  return (
    <div className="space-y-6">
      {/* === Image Preview - Full Width === */}
      <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex flex-col justify-center aspect-video max-w-4xl mx-auto">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={test.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <div className="text-center">
              <ImageIcon size={64} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm italic">No Image Available</p>
            </div>
          </div>
        )}
      </div>

      {/* === Audio Player === */}
      {audioUrl && (
        <div className="max-w-4xl mx-auto border border-gray-200 rounded-lg p-4 flex items-center gap-4">
          <div className="shrink-0 text-gray-500">
            <FileAudio size={24} />
          </div>
          <audio controls className="w-full" src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* === Title & Description === */}
      <div className="text-center px-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
          {test.title}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto whitespace-pre-wrap">
          {test.description || "No description provided."}
        </p>
      </div>

      {/* === Test Information === */}
      <div className="border border-gray-200 rounded-lg p-5">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700">
            Test Information
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-3 border border-gray-100 rounded-lg">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">
                Test Type
              </p>
              <p className="text-sm font-medium text-gray-900">
                {test.test_type || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-3 border border-gray-100 rounded-lg">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Duration</p>
              <p className="text-sm font-medium text-gray-900">
                {test.duration} minutes
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-3 border border-gray-100 rounded-lg">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">
                Collection
              </p>
              <p className="text-sm font-medium text-gray-900">
                {test.collection?.name || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-3 border border-gray-100 rounded-lg">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
              <div
                className={`inline-flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-md ${
                  test.status === "PUBLISHED"
                    ? "bg-green-100 text-green-700"
                    : test.status === "ARCHIVED"
                      ? "bg-gray-100 text-gray-700"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/60 hover:shadow-md transition-all">
          <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
            Created At
          </p>
          <p className="text-sm text-gray-900 font-medium">
            {formatISODate(test.created_at)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Last Updated</p>
          <p className="text-sm text-gray-900 font-medium">
            {formatISODate(test.updated_at)}
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Created By</p>
          <p
            className="text-sm text-gray-900 font-medium truncate"
            title={
              typeof test.created_by === "object"
                ? test.created_by.display_name
                : test.created_by || "System"
            }
          >
            {typeof test.created_by === "object"
              ? test.created_by.display_name || test.created_by.id
              : test.created_by || "System"}
          </p>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-4 border border-teal-200/60 hover:shadow-md transition-all">
          <p className="text-xs font-bold text-teal-700 mb-2 uppercase tracking-wide">
            Updated By
          </p>
          <p
            className="text-sm text-gray-900 font-semibold truncate"
            title={
              typeof test.updated_by === "object"
                ? test.updated_by.display_name
                : test.updated_by ||
                  test.updatedBy?.display_name ||
                  test.updatedBy ||
                  "System"
            }
          >
            {typeof test.updated_by === "object"
              ? test.updated_by.display_name || test.updated_by.id
              : test.updated_by ||
                test.updatedBy?.display_name ||
                test.updatedBy ||
                "System"}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/60 hover:shadow-md transition-all">
          <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Test ID
          </p>
          <p className="text-sm text-gray-900 font-mono font-medium">
            #{test.id}
          </p>
        </div>
      </div>

      {/* === Content Information === */}
      {(test.questions_count !== undefined ||
        test.passages_count !== undefined ||
        test.questions?.length !== undefined ||
        test.passages?.length !== undefined) && (
        <div className="mt-6 flex justify-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
            <span className="font-medium text-sm">
              {test.passages_count !== undefined
                ? test.passages_count
                : test.passages?.length || 0}{" "}
              Passages
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
            <span className="font-medium text-sm">
              {test.questions_count !== undefined
                ? test.questions_count
                : test.questions?.length || 0}{" "}
              Questions
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToeicTestDetails;

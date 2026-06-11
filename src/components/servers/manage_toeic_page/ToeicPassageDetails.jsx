import {
  Image as ImageIcon,
  FileAudio,
  FileText,
  Languages,
} from "lucide-react";
import DOMPurify from "dompurify";

const ToeicPassageDetails = ({ passage }) => {
  const imageUrl =
    passage.imageUrl ||
    passage.image_url ||
    passage.image_request?.uploaded_image ||
    passage.image_request?.image_url;
  const audioUrl =
    passage.audioUrl ||
    passage.audio_url ||
    passage.audio_request?.uploaded_audio ||
    passage.audio_request?.audio_url;

  return (
    <div className="space-y-6">
      {/* Media Preview - Row Layout */}
      {(imageUrl || audioUrl) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {imageUrl && (
            <div className="rounded-xl overflow-hidden shadow border border-gray-200 dark:border-gray-700 bg-gray-50 flex items-center justify-center max-h-64">
              <img
                src={imageUrl}
                alt="Passage Illustration"
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
                  Passage Audio
                </span>
              </div>
              <audio controls className="w-full" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}

      {/* Passage Content & Translation side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* English Passage Text */}
        <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-gray-800 dark:to-gray-750 p-6 rounded-2xl border border-blue-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-blue-200/50 dark:border-gray-600 pb-2">
            <div className="p-1.5 bg-blue-100/50 rounded-lg">
              <FileText size={16} className="text-blue-600" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
              Passage Text
            </h4>
          </div>
          <div
            className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 min-h-[100px] leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                passage.passageText ||
                  passage.passage_text ||
                  "No text provided.",
              ),
            }}
          />
        </div>

        {/* Translation */}
        <div className="bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-gray-800 dark:to-gray-750 p-6 rounded-2xl border border-green-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-green-200/50 dark:border-gray-600 pb-2">
            <div className="p-1.5 bg-green-100/50 rounded-lg">
              <Languages size={16} className="text-green-600" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
              Translation
            </h4>
          </div>
          <div
            className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 min-h-[100px] leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                passage.passageTrans ||
                  passage.passage_trans ||
                  "No translation provided.",
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ToeicPassageDetails;

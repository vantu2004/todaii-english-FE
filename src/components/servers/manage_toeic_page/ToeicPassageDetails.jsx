import { useState } from "react";
import DOMPurify from "dompurify";

const ToeicPassageDetails = ({ passage }) => {
  const [activeTab, setActiveTab] = useState("en");

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

  const passageTextRaw = passage.passageText || passage.passage_text;
  const translationRaw = passage.passageTrans || passage.passage_trans;

  const hasPassageText = Boolean(passageTextRaw);
  const hasTranslation = Boolean(translationRaw);
  const hasImage = Boolean(imageUrl);
  const hasAudio = Boolean(audioUrl);
  const soloMedia = hasImage !== hasAudio;

  const emptyClass = "italic text-gray-400 dark:text-gray-500";
  const proseClass =
    "prose prose-sm min-w-0 max-w-none break-words overflow-x-auto text-sm leading-relaxed text-gray-800 dark:prose-invert dark:text-gray-200";

  return (
    <div className="min-w-0 space-y-6">
      {/* Reference media */}
      {(hasImage || hasAudio) && (
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
          {hasImage && (
            <figure
              className={`flex min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 ${
                soloMedia ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex max-h-64 items-center justify-center p-4">
                <img
                  src={imageUrl}
                  alt="Passage reference"
                  className="max-h-60 max-w-full object-contain rounded"
                />
              </div>
            </figure>
          )}

          {hasAudio && (
            <div
              className={`flex min-w-0 flex-col justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900 ${
                soloMedia ? "md:col-span-2" : ""
              }`}
            >
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Audio Reference
              </span>
              <audio controls className="w-full mt-1" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}

      {/* Text Container with Tabs */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-hidden">
        {hasPassageText && hasTranslation ? (
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-6">
            <button
              onClick={() => setActiveTab("en")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === "en"
                  ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Passage Text (EN)
            </button>
            <button
              onClick={() => setActiveTab("vi")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === "vi"
                  ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Translation (VI)
            </button>
          </div>
        ) : (
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-6 py-3">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {hasPassageText ? "Passage Text" : "Translation"}
            </span>
          </div>
        )}

        <div className="p-6">
          {activeTab === "en" || !hasTranslation ? (
            <div
              className={`${proseClass} ${hasPassageText ? "" : emptyClass}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  passageTextRaw || "No text provided.",
                ),
              }}
            />
          ) : (
            <div
              className={`${proseClass} ${hasTranslation ? "" : emptyClass}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  translationRaw || "No translation provided.",
                ),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ToeicPassageDetails;

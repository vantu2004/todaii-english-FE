import { Search, Volume2, CheckCircle, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { playAudioWithEvent } from "@/utils/playAudio";

const DictionaryWordsList = ({
  words,
  isWordSelected,
  onSelectWord,
  onViewWord,
}) => {
  if (words.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-8 sm:py-10 md:py-12">
          <Search className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            No words found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
      {words.map((word) => {
        const isSelected = isWordSelected(word.id);
        return (
          <div
            key={word.id}
            onClick={() => onSelectWord(word.id)}
            className={`p-3 sm:p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors group ${
              isSelected
                ? "bg-gray-200 dark:bg-gray-800/80"
                : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-8 text-xs text-gray-400">
                #{word.id}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {word.headword}
                  </h3>
                  {word.ipa && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                      {word.ipa}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {word.audio_url && (
                <button
                  onClick={(e) => playAudioWithEvent(e, word.audio_url)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400" />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewWord(word);
                }}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DictionaryWordsList;

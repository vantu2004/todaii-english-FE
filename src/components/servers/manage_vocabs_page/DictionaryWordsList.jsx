import { Search, Volume2, Eye } from "lucide-react";
import { playAudioWithEvent } from "@/utils/PlayAudio";
import { parseDictionaryWord } from "@/utils/wordParser";

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
    <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
      {words.map((item) => {
        const word = parseDictionaryWord(item);
        const isSelected = isWordSelected(word.id);
        return (
          <div
            key={word.id}
            onClick={() => onSelectWord(word.id)}
            className={`p-3.5 sm:p-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 group border-l-2 ${
              isSelected
                ? "bg-gray-50 dark:bg-gray-800/40 border-gray-900 dark:border-white"
                : "bg-white dark:bg-gray-900 border-transparent hover:bg-gray-50/50 dark:hover:bg-gray-850"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 min-w-[40px] text-center font-mono text-[10px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 rounded px-1.5 py-0.5 border border-gray-100 dark:border-gray-700">
                #{word.id}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate tracking-tight">
                    {word.word}
                  </h3>
                  {word.ipa && (
                    <span className="text-[11px] text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono truncate">
                      /{word.ipa}/
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
              {word.audio_url && (
                <button
                  onClick={(e) => playAudioWithEvent(e, word.audio_url)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md transition-all duration-150"
                  title="Play Pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewWord(item);
                }}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md transition-all duration-150"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DictionaryWordsList;

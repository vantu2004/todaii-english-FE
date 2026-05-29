import { Volume2, Trash2, GripVertical, Sparkles, Eye } from "lucide-react";
import { playAudioWithEvent } from "@/utils/PlayAudio";

const SelectedWordCard = ({ word, index, onViewWord, onRemove }) => {
  return (
    <div className="group flex items-center justify-between gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 transition-colors shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <GripVertical className="w-4 h-4 text-gray-400 cursor-move flex-shrink-0" />
        <div className="min-w-0 flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {word.headword}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>#{index + 1}</span>
            {word.ipa && (
              <>
                <span>&bull;</span>
                <span className="font-mono truncate">{word.ipa}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {word.audio_url && (
          <button
            onClick={(e) => playAudioWithEvent(e, word.audio_url)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onViewWord(word)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onRemove(word.id)}
          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SelectedWordCard;

import { Eye, Volume2, CheckCircle, Lightbulb, Link2 } from "lucide-react";
import Modal from "../Modal";
import { formatISODate } from "../../../utils/FormatDate";
import { useState } from "react";
import toast from "react-hot-toast";

const DictionaryViewModal = ({ isOpen, onClose, dictionary }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!dictionary) return null;

  const handlePlayAudio = async () => {
    if (dictionary.audio_url) {
      setIsPlaying(true);
      try {
        const audio = new Audio(dictionary.audio_url);
        audio.onended = () => setIsPlaying(false);
        await audio.play();
      } catch (err) {
        console.error(err);
        toast.error("Audio playback failed");
        setIsPlaying(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
            <Eye className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Dictionary Entry
            </h2>
            <p className="text-sm text-gray-500">View dictionary details</p>
          </div>
        </div>
      }
      width="sm:max-w-4xl"
    >
      <div className="space-y-5">
        {/* Header: Headword + IPA + Audio */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-4xl font-bold text-gray-900 mb-1">
              {dictionary.headword}
            </h3>
            {dictionary.ipa && (
              <p className="text-sm text-gray-600 font-mono">
                {dictionary.ipa}
              </p>
            )}
          </div>
          {dictionary.audio_url && (
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <Volume2 size={16} className={isPlaying ? "animate-pulse" : ""} />
              {isPlaying ? "Playing..." : "Play"}
            </button>
          )}
        </div>

        {/* Updated at */}
        <div className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
          <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
          <span>Updated {formatISODate(dictionary.updated_at)}</span>
        </div>

        {/* Senses */}
        <div className="space-y-4">
          {dictionary.senses?.map((sense, idx) => (
            <div
              key={sense.id || idx}
              className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all space-y-4"
            >
              {/* POS Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                  {sense.pos}
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Meaning */}
              {sense.meaning && (
                <p className="text-gray-900">
                  <span className="font-semibold text-blue-600">Meaning:</span>{" "}
                  {sense.meaning}
                </p>
              )}

              {/* Definition */}
              {sense.definition && (
                <p className="text-gray-700">
                  <span className="font-semibold text-blue-600">
                    Definition:
                  </span>{" "}
                  {sense.definition}
                </p>
              )}

              {/* Example */}
              {sense.example && (
                <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                  <p className="text-xs font-bold text-amber-900 flex items-center gap-2 mb-2">
                    <Lightbulb size={14} />
                    Example
                  </p>
                  <p className="text-gray-700 italic">"{sense.example}"</p>
                </div>
              )}

              {/* Synonyms */}
              {sense.synonyms?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Synonyms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sense.synonyms.map((syn, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Collocations */}
              {sense.collocations?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Link2 size={12} />
                    Collocations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sense.collocations.map((col, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default DictionaryViewModal;

import { Volume2, BookOpen, Lightbulb, Link2 } from "lucide-react";
import Modal from "@/components/servers/Modal";
import { formatISODate } from "@/utils/FormatDate";
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
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Dictionary Entry
          </h2>
        </div>
      }
      width="sm:max-w-4xl"
    >
      <div className="space-y-5">
        {/* Header Section */}
        <div className="border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {dictionary.headword}
              </h3>
              {dictionary.ipa && (
                <p className="text-lg text-gray-600 mt-2 font-mono">
                  {dictionary.ipa}
                </p>
              )}
            </div>
            {dictionary.audio_url && (
              <button
                onClick={() => handlePlayAudio(dictionary.audio_url)}
                className={`p-2.5 ${isPlaying ? "bg-gray-400" : "bg-gray-900"} text-white rounded-lg hover:bg-gray-800 transition-all`}
                title="Play pronunciation"
                disabled={isPlaying}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <span>Updated at: {formatISODate(dictionary.updated_at)}</span>
          </div>
        </div>

        {/* Senses */}
        <div className="space-y-4">
          {dictionary.senses?.map((sense, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-5 transition-colors"
            >
              {/* POS and Meaning */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-200">
                  {sense.pos}
                </span>
                <span className="text-lg font-medium text-gray-800">
                  {sense.meaning}
                </span>
              </div>

              <div className="space-y-4">
                {/* Definition */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <span className="text-gray-700 leading-relaxed text-[15px]">
                      {sense.definition}
                    </span>
                  </div>
                </div>

                {/* Example */}
                {sense.example && (
                  <div className="flex gap-3 bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                    <div className="italic text-gray-700 leading-relaxed">
                      "{sense.example}"
                    </div>
                  </div>
                )}

                {/* Synonyms and Collocations */}
                {(sense.synonyms?.length > 0 ||
                  sense.collocations?.length > 0) && (
                  <div className="pt-4 border-t border-gray-100 grid sm:grid-cols-2 gap-4">
                    {sense.synonyms?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Synonyms
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {sense.synonyms.map((syn, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm border border-gray-200 font-medium cursor-default"
                            >
                              {syn}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {sense.collocations?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Collocations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {sense.collocations.map((col, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm border border-gray-200 font-medium cursor-default"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default DictionaryViewModal;

import { Pencil, Trash2, Volume2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ToeicQuestionsTable = ({
  questions,
  partNumber,
  onEdit,
  onDelete,
  passages,
}) => {
  const [playingId, setPlayingId] = useState(null);

  const audioRef = useRef(null);

  const handlePlayAudio = async (question) => {
    const audioUrl = question.audio_url;

    if (!audioUrl) return;

    // click same audio again -> stop
    if (playingId === question.id && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current = null;
      setPlayingId(null);

      return;
    }

    try {
      // stop previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(audioUrl);

      audioRef.current = audio;

      setPlayingId(question.id);

      audio.onended = () => {
        audioRef.current = null;
        setPlayingId(null);
      };

      await audio.play();
    } catch (err) {
      console.error(err);

      audioRef.current = null;
      setPlayingId(null);
    }
  };

  const getAudioUrl = (question) => question.audio_url;

  const getImageUrl = (question) => question.image_url;

  const isPart12 = partNumber === 1 || partNumber === 2;

  const getPassageInfo = (passageId) => {
    const passage = passages?.find((p) => p.id === passageId);
    return passage ? `Passage #${passage.id}` : "N/A";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 w-16">ID</th>
              {!isPart12 && partNumber !== 5 && (
                <th className="px-6 py-4 w-32">Passage</th>
              )}
              <th className="px-6 py-4 min-w-[200px]">
                {isPart12 ? "Transcript (Preview)" : "Question"}
              </th>
              <th className="px-6 py-4">Correct Answer</th>
              <th className="px-6 py-4">Explanation</th>
              <th className="px-6 py-4 w-32">Tags</th>
              {isPart12 && <th className="px-6 py-4">Media</th>}
              <th className="px-6 py-4 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {questions.map((question) => (
              <tr
                key={question.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {question.id}
                </td>

                {!isPart12 && partNumber !== 5 && (
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                      {getPassageInfo(question.passage_id)}
                    </span>
                  </td>
                )}

                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                  {isPart12
                    ? question.transcript || "No transcript"
                    : question.question || "No question"}
                </td>

                <td className="px-6 py-4 text-sm">
                  <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                    {question.correct_ans || "N/A"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                  {question.explanation || "No explanation"}
                </td>

                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {question.tags?.length > 0 ? (
                      question.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs whitespace-nowrap"
                        >
                          {tag.alias}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        No tags
                      </span>
                    )}
                  </div>
                </td>

                {isPart12 && (
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2 items-center">
                      {getImageUrl(question) && (
                        <ImageIcon
                          size={18}
                          className="text-blue-500 cursor-pointer"
                          title="Has Image"
                        />
                      )}
                      {getAudioUrl(question) && (
                        <button
                          onClick={() => handlePlayAudio(question)}
                          className="text-purple-500 hover:text-purple-700 transition cursor-pointer"
                          title="Play Audio"
                        >
                          <Volume2
                            size={18}
                            className={
                              playingId === question.id ? "animate-pulse" : ""
                            }
                          />
                        </button>
                      )}
                      {!getImageUrl(question) && !getAudioUrl(question) && (
                        <span className="text-gray-400 italic text-xs">
                          None
                        </span>
                      )}
                    </div>
                  </td>
                )}

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onEdit(question)}
                      className="text-yellow-600 hover:text-yellow-800 transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(question.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {questions.length === 0 && (
              <tr>
                <td
                  colSpan={isPart12 ? 7 : partNumber === 5 ? 6 : 7}
                  className="px-6 py-8 text-center text-gray-500 text-sm italic"
                >
                  No questions found for this part.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToeicQuestionsTable;

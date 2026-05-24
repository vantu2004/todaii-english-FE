import { Pencil, Trash2, Volume2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";

const ToeicQuestionsTable = ({ questions, partNumber, onEdit, onDelete }) => {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-500">
              <th className="px-6 py-4 w-16">ID</th>
              {!isPart12 && partNumber !== 5 && (
                <th className="px-6 py-4 w-32">Passage ID</th>
              )}
              <th className="px-6 py-4 min-w-[200px]">
                {isPart12 ? "Transcript (Preview)" : "Question"}
              </th>
              {!isPart12 && (
                <>
                  <th className="px-6 py-4">Option A</th>
                  <th className="px-6 py-4">Option B</th>
                  <th className="px-6 py-4">Option C</th>
                  <th className="px-6 py-4">Option D</th>
                </>
              )}
              <th className="px-6 py-4">Correct Answer</th>
              <th className="px-6 py-4 min-w-[200px]">Explanation</th>
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
                    {question.passage_id}
                  </td>
                )}

                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div
                    className="truncate max-w-xs line-clamp-3 prose dark:prose-invert prose-sm"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        isPart12
                          ? question.transcript || "No transcript"
                          : question.question || "No question",
                      ),
                    }}
                  />
                </td>

                {!isPart12 && (
                  <>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate"
                      title={question.option_a}
                    >
                      {question.option_a}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate"
                      title={question.option_b}
                    >
                      {question.option_b}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate"
                      title={question.option_c}
                    >
                      {question.option_c}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate"
                      title={question.option_d}
                    >
                      {question.option_d}
                    </td>
                  </>
                )}

                <td className="px-6 py-4 text-sm">
                  <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                    {question.correct_ans || "N/A"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div
                    className="truncate max-w-xs line-clamp-3 prose dark:prose-invert prose-sm"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        question.explanation || "No explanation",
                      ),
                    }}
                  />
                </td>

                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {question.tags?.length > 0 ? (
                      question.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs whitespace-nowrap border border-gray-200"
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
                          size={16}
                          className="text-gray-400 cursor-pointer"
                          title="Has Image"
                        />
                      )}
                      {getAudioUrl(question) && (
                        <button
                          onClick={() => handlePlayAudio(question)}
                          className="text-gray-400 hover:text-gray-700 transition cursor-pointer"
                          title="Play Audio"
                        >
                          <Volume2
                            size={16}
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
                      className="text-gray-400 hover:text-gray-700 transition"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(question.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {questions.length === 0 && (
              <tr>
                <td
                  colSpan={isPart12 ? 7 : partNumber === 5 ? 10 : 11}
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

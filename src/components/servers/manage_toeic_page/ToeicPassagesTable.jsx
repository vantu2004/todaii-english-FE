import { Pencil, Trash2, Volume2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

const ToeicPassagesTable = ({ passages, onEdit, onDelete }) => {
  const [playingId, setPlayingId] = useState(null);

  const handlePlayAudio = async (passage) => {
    const audioUrl =
      passage.audioUrl ||
      passage.audio_url ||
      passage.audio_request?.uploaded_audio ||
      passage.audio_request?.audio_url;
    if (audioUrl) {
      setPlayingId(passage.id);
      try {
        const audio = new Audio(audioUrl);
        audio.onended = () => setPlayingId(null);
        await audio.play();
      } catch (err) {
        console.error(err);
        setPlayingId(null);
      }
    }
  };

  const getAudioUrl = (passage) =>
    passage.audioUrl ||
    passage.audio_url ||
    passage.audio_request?.uploaded_audio ||
    passage.audio_request?.audio_url;
  const getImageUrl = (passage) =>
    passage.imageUrl ||
    passage.image_url ||
    passage.image_request?.uploaded_image ||
    passage.image_request?.image_url;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 w-16">ID</th>
              <th className="px-6 py-4 min-w-[200px]">
                Passage Text (Preview)
              </th>
              <th className="px-6 py-4">Media</th>
              <th className="px-6 py-4 w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {passages.map((passage) => (
              <tr
                key={passage.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {passage.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                  {passage.passageText || passage.passage_text || "No text"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2 items-center">
                    {getImageUrl(passage) && (
                      <ImageIcon
                        size={18}
                        className="text-blue-500"
                        title="Has Image"
                      />
                    )}
                    {getAudioUrl(passage) && (
                      <button
                        onClick={() => handlePlayAudio(passage)}
                        disabled={playingId === passage.id}
                        className="text-purple-500 hover:text-purple-700 transition"
                        title="Play Audio"
                      >
                        <Volume2
                          size={18}
                          className={
                            playingId === passage.id ? "animate-pulse" : ""
                          }
                        />
                      </button>
                    )}
                    {!getImageUrl(passage) && !getAudioUrl(passage) && (
                      <span className="text-gray-400 italic text-xs">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onEdit(passage)}
                      className="text-yellow-600 hover:text-yellow-800 transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(passage.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {passages.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-8 text-center text-gray-500 text-sm italic"
                >
                  No passages found for this part.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToeicPassagesTable;

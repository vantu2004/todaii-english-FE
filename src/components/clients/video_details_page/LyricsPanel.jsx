import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getVideoLyrics } from "../../../api/clients/videoLyricApi"; // Import hàm API của bạn

const LyricsPanel = ({ videoId }) => {
  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setLoading(true);
        const data = await getVideoLyrics(videoId);
        // API trả về response.data hoặc mảng trực tiếp tùy backend, giả sử trả về mảng
        setLyrics(data || []);
      } catch (err) {
        console.error("Fetch lyrics error", err);
        setError("Không tìm thấy lời bài hát.");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchLyrics();
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || lyrics.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
        {error || "Chưa có lời bài hát cho video này."}
      </div>
    );
  }

  return (
    <div className="h-[400px] md:h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="space-y-4">
        {lyrics.map((line) => (
          <div
            key={line.id}
            className="p-2 rounded hover:bg-purple-50 transition-colors group"
          >
            <div className="flex gap-2">
              <span className="text-xs text-gray-400 font-mono w-8 pt-1">
                {/* Convert ms to mm:ss */}
                {new Date(line.start_ms).toISOString().slice(14, 19)}
              </span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium text-sm">
                  {line.text_en}
                </p>
                {line.text_vi && (
                  <p className="text-purple-600 text-sm mt-0.5">
                    {line.text_vi}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LyricsPanel;

import { useEffect, useState } from "react";
import { Loader2, ListMusic, Clock } from "lucide-react";
import { getVideoLyrics } from "../../../api/clients/videoLyricApi";
import { logError } from "../../../utils/LogError";

const LyricsPanel = ({ videoId }) => {
  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setLoading(true);
        const data = await getVideoLyrics(videoId);
        setLyrics(data || []);
      } catch (err) {
        logError(err);
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
      <div className="bg-white rounded-3xl border border-neutral-100 h-[500px] flex items-center justify-center">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
        <ListMusic size={18} className="text-neutral-500" />
        <h3 className="font-bold text-neutral-900">Nội dung phụ đề</h3>
        <span className="ml-auto text-xs font-medium text-neutral-400 bg-white px-2 py-1 rounded-md border border-neutral-200">
          {lyrics.length} lines
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar hover:scroll-auto">
        {lyrics.length > 0 ? (
          <div className="space-y-1">
            {lyrics.map((line) => (
              <div
                key={line.id}
                className="group flex gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-neutral-100"
              >
                {/* Timestamp Badge */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 text-neutral-500 text-xs font-mono font-medium group-hover:bg-white group-hover:shadow-sm transition-colors">
                    <Clock size={10} />
                    {new Date(line.start_ms).toISOString().slice(14, 19)}
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <p className="text-neutral-900 font-medium text-sm leading-relaxed">
                    {line.text_en}
                  </p>
                  {line.text_vi && (
                    <p className="text-neutral-500 text-sm mt-1 italic leading-relaxed">
                      {line.text_vi}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-sm">
            <p>Chưa có phụ đề cho video này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LyricsPanel;

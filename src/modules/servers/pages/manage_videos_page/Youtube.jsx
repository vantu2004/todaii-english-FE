import {
  ExternalLink,
  Search,
  Loader,
  X,
  History,
  Download,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchVideoFromYoutube } from "../../../../api/servers/videoApi";

const Youtube = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const debounceTimerRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("youtubeSearchHistory");
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (err) {
        console.error("Error loading search history:", err);
      }
    }
  }, []);

  const getVideos = async (query) => {
    if (!query.trim()) {
      setVideos([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchVideoFromYoutube(query);
      const formatted = Array.isArray(response) ? response : [response];
      setVideos(formatted);

      if (formatted.length > 0) {
        setSearchHistory((prev) => {
          const newItems = formatted.map((v) => ({
            title: v.title,
            url: v.video_url,
            author: v.author_name,
            thumbnail: v.thumbnail_url,
          }));
          const combined = [
            ...newItems,
            ...prev.filter(
              (item) => !newItems.some((n) => n.title === item.title)
            ),
          ];
          const updated = combined.slice(0, 10);
          localStorage.setItem("youtubeSearchHistory", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      getVideos(value);
    }, 500);
  };

  const removeFromHistory = (term) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item.title !== term.title);
      localStorage.setItem("youtubeSearchHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("youtubeSearchHistory");
  };

  const exportVideo = (video) => {
    const videoData = {
      title: video.title,
      author: video.author_name,
      provider: video.provider_name,
      provider_url: video.provider_url,
      url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      cefr_level: video.cefr_level || "N/A",
      exportedAt: new Date().toISOString(),
    };
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(videoData, null, 2))
    );
    element.setAttribute("download", `${video.title}.json`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br p-6">
      <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
        YouTube Search
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center p-1 rounded-lg text-gray-600 dark:text-gray-400 
           hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          title="Visit YouTube"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </h2>

      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          autoFocus
          value={searchTerm}
          placeholder="Enter YouTube URL..."
          onChange={handleInputChange}
          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 
                rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200
                dark:focus:border-red-400 dark:focus:ring-red-900/20
                transition-all duration-200 text-base"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader className="w-5 h-5 text-red-600 dark:text-red-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Recent Searches */}
      {searchHistory.length > 0 && (
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Recent Searches
              </h3>
            </div>
            <button
              onClick={clearHistory}
              className="text-xs font-medium text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((term, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg
                  hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <button
                  onClick={() => {
                    setSearchTerm(term.title);
                    getVideos(term.url);
                  }}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
                >
                  {term.title}
                </button>
                <button
                  onClick={() => removeFromHistory(term)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex gap-6 flex-1 overflow-hidden mt-8">
        {/* Left - Video Results */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 text-red-600 dark:text-red-400 animate-spin mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Fetching video...
              </p>
            </div>
          ) : videos && videos.length > 0 ? (
            <div className="space-y-6 pr-4">
              {videos.map((video, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50
                      hover:shadow-md dark:hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col gap-0">
                    {/* Video Embed */}
                    <div className="w-full h-96 bg-black relative overflow-hidden">
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: video.embed_html }}
                      />
                    </div>

                    {/* Info Below Video */}
                    <div className="bg-gray-50 dark:bg-gray-900 overflow-y-auto flex flex-col">
                      {/* Header */}
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-base font-bold text-gray-900 dark:text-gray-50 line-clamp-3 mb-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {video.provider_name}
                        </p>
                      </div>

                      {/* Channel Info */}
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-3">
                          Channel
                        </p>
                        <div className="flex items-center gap-3">
                          <img
                            src={video.thumbnail_url}
                            alt={video.author_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                              {video.author_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {video.provider_name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Video Details */}
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2">
                            Provider
                          </p>
                          <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                            {video.provider_name}
                          </p>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="p-6 space-y-3">
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" /> Open on YouTube
                        </a>
                        <button
                          onClick={() => exportVideo(video)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors duration-200 text-sm"
                        >
                          <Download className="w-4 h-4" /> Export
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No video found for "
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {searchTerm}
                </span>
                "
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Enter a YouTube URL to see video info
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Recent Searches List */}
        {searchHistory.length > 0 && (
          <div className="w-96 flex-shrink-0 bg-white dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-700/50 shadow-sm h-fit max-h-96 overflow-y-auto sticky top-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wide">
                  Recent Videos
                </h3>
              </div>
              <button
                onClick={clearHistory}
                className="text-xs font-medium text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                title="Clear all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {searchHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="group p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 cursor-pointer"
                >
                  <button
                    onClick={() => {
                      setSearchTerm(item.title);
                      getVideos(item.url);
                    }}
                    className="w-full text-left"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase">
                          Video
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium line-clamp-2 mb-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {item.author}
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => removeFromHistory(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 dark:hover:text-red-400 mt-2 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Youtube;

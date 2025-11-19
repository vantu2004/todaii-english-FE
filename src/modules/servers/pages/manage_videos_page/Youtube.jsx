import { ExternalLink, Search, Loader, X, History } from "lucide-react";
import { useState, useEffect } from "react";
import SearchByUrl from "../../../../components/servers/youtube_data_api_v3/SearchByUrl";
import SearchByKeyword from "../../../../components/servers/youtube_data_api_v3/SearchByKeyword";
import {
  fetchVideoByUrl,
  fetchVideoByKeyword,
} from "../../../../api/servers/videoApi";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";

const truncateText = (text, maxLength = 50) =>
  text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

const isUrl = (text) => /^https?:\/\//.test(text);

const Youtube = () => {
  const { setHeader } = useHeaderContext();

  const [videoUrl, setVideoUrl] = useState();
  const [videosKeyword, setVideosKeyword] = useState({
    video: [],
    playlist: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    setHeader({
      title: "Manage Videos",
      breadcrumb: [{ label: "Home", to: "/server" }, { label: "Youtube" }],
    });
  }, []);

  // Load recent searches
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

  const saveHistory = (term) => {
    const truncated = truncateText(term);
    setSearchHistory((prev) => {
      const updated = [truncated, ...prev.filter((t) => t !== truncated)].slice(
        0,
        10
      );
      localStorage.setItem("youtubeSearchHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = async (term) => {
    if (!term.trim()) return;
    saveHistory(term);
    setSearchTerm(term);
    setIsLoading(true);

    try {
      if (isUrl(term)) {
        // Search by URL
        const result = await fetchVideoByUrl(term);
        setVideoUrl(result);
      } else {
        // Search by keyword (2 types)
        const [videos, playlists] = await Promise.all([
          fetchVideoByKeyword(term, "video", 20),
          fetchVideoByKeyword(term, "playlist", 5),
        ]);
        setVideosKeyword({
          video: videos.items || [],
          playlist: playlists.items || [],
        });
      }
    } catch (err) {
      console.error(err);
      setVideoUrl();
      setVideosKeyword({ video: [], playlist: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchTerm);
    }
  };

  const removeFromHistory = (term) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((t) => t !== term);
      localStorage.setItem("youtubeSearchHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("youtubeSearchHistory");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br">
      {/* Header */}
      <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
        YouTube Search
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center p-1 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
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
          placeholder="Enter YouTube URL or keyword..."
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:border-red-400 dark:focus:ring-red-900/20 transition-all duration-200 text-base"
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
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <button
                  onClick={() => handleSearch(term)}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
                >
                  {term}
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
        {/* Left - Video Results (URL) */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 text-red-600 dark:text-red-400 animate-spin mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Fetching video...
              </p>
            </div>
          ) : isUrl(searchTerm) ? (
            videoUrl ? (
              <SearchByUrl video={videoUrl} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No video found for "
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {searchTerm}
                  </span>
                  "
                </p>
              </div>
            )
          ) : searchTerm ? (
            <SearchByKeyword
              videos={videosKeyword}
              onClickVideo={handleSearch}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Enter a YouTube URL or keyword to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Youtube;

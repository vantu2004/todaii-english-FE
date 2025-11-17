import React, { useState } from "react";
import { Play, Grid, List, Volume2 } from "lucide-react";

const SearchByKeyword = ({ videos, onClickVideo }) => {
  const { video = [], playlist = [] } = videos;
  const [viewMode, setViewMode] = useState("grid");

  const VIDEO_BASE_URL = "https://www.youtube.com/watch?v=";
  const PLAYLIST_BASE_URL = "https://www.youtube.com/playlist?list=";

  return (
    <div className="h-full bg-gradient-to-br text-gray-900 flex flex-col overflow-hidden">
      {/* Main Content - Single Scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex h-full">
          {/* Main Video Section (2/3) */}
          <div className="w-2/3 border-r border-gray-200 pr-6">
            {video.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-gradient-to-b from-gray-50 to-transparent z-10">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                    <Play className="w-6 h-6 text-blue-600" />
                    Videos
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Loop through videos */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 gap-4">
                    {video.map((v, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          onClickVideo(VIDEO_BASE_URL + v.id.video_id)
                        }
                        className="group cursor-pointer rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100"
                      >
                        <div className="relative overflow-hidden h-32">
                          <img
                            src={v.snippet.thumbnails.high.url}
                            alt={v.snippet.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Play className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                            {v.snippet.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {v.snippet.channel_title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {video.map((v, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          onClickVideo(VIDEO_BASE_URL + v.id.video_id)
                        }
                        className="flex gap-4 p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer group"
                      >
                        <img
                          src={v.snippet.thumbnails.high.url}
                          alt={v.snippet.title}
                          className="w-24 h-16 rounded object-cover group-hover:brightness-110 transition-all"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-blue-600">
                            {v.snippet.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {v.snippet.channel_title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Volume2 className="w-12 h-12 mb-3 opacity-50" />
                <p>No videos found</p>
              </div>
            )}
          </div>

          {/* Playlist Section (1/3) */}
          <div className="w-1/3  pl-6">
            {playlist.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 sticky top-0 bg-gradient-to-b from-gray-50 to-transparent pb-2 z-10">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                  Playlists
                </h2>

                {/* Loop through playlists */}
                <div className="space-y-3">
                  {playlist.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        window.open(
                          PLAYLIST_BASE_URL + p.id.playlist_id,
                          "_blank"
                        )
                      }
                      className="group rounded-lg overflow-hidden bg-white border border-gray-200 hover:border-cyan-400 transition-all duration-300 cursor-pointer hover:shadow-md hover:shadow-cyan-100"
                    >
                      <div className="relative overflow-hidden h-24">
                        <img
                          src={p.snippet.thumbnails.high.url}
                          alt={p.snippet.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-cyan-600 transition-colors">
                          {p.snippet.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          {p.snippet.channel_title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                  <List className="w-6 h-6 opacity-50" />
                </div>
                <p className="text-sm">No playlists found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchByKeyword;

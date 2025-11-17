import {
  Play,
  Eye,
  Zap,
  Layers,
  ExternalLink,
  Youtube,
  Camera,
  User,
  Hash,
} from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";

const VideoDetails = ({ video }) => {
  return (
    <div className="space-y-6">
      {/* === Video Player - Full Width === */}
      <div className="rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all aspect-video max-w-4xl mx-auto">
        {video.embed_html ? (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: video.embed_html }}
          />
        ) : video.thumbnail_url ? (
          <div className="relative w-full h-full">
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-all">
              <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform cursor-pointer">
                <Play size={40} className="text-white ml-1" fill="white" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400">
            <div className="text-center">
              <Camera size={64} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm italic">No Video Available</p>
            </div>
          </div>
        )}
      </div>

      {/* === Video Title === */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
          {video.title}
        </h1>
      </div>

      {/* === Topics === */}
      {video.topics?.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-2xl p-6 border border-green-200/60 hover:border-green-300/80 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-100/50 rounded-lg">
              <Layers size={18} className="text-green-600" />
            </div>
            <h4 className="text-base font-bold text-gray-900 uppercase tracking-wide">
              Topics ({video.topics.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {video.topics.map((topic) => (
              <div
                key={topic.id}
                className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-green-700 border border-green-200/50 shadow-sm hover:shadow-md transition-all"
              >
                <span className="inline-block">
                  {topic.name}
                  {topic.is_deleted && (
                    <span className="ml-1 text-red-500 text-xs">(Deleted)</span>
                  )}
                  {!topic.enabled && (
                    <span className="ml-1 text-gray-400 text-xs">
                      (Disabled)
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Two Column Section: Thumbnail + Details === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thumbnail Preview */}
        {video.thumbnail_url && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 hover:border-red-300/60 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-red-100/50 rounded-lg">
                <Camera size={18} className="text-red-600" />
              </div>
              <h4 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                Thumbnail Preview
              </h4>
            </div>
            <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <img
                src={video.thumbnail_url}
                alt={`${video.title} thumbnail`}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Video Information */}
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border border-red-200/50 hover:border-red-300/60 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-100/50 rounded-lg">
              <Youtube size={18} className="text-red-600" />
            </div>
            <h4 className="text-base font-bold text-gray-900 uppercase tracking-wide">
              Video Information
            </h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <User size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Author
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {video.author_name || "Unknown Author"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <Youtube
                size={18}
                className="text-red-600 flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Provider
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {video.provider_name || "Unknown Provider"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <Zap size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Cefr Level
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {video.cefr_level}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <Eye size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Views
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {video.views.toLocaleString()} views
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <Hash size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Status
                </p>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full"
                  style={{
                    backgroundColor: video.enabled ? "#d1fae5" : "#fee2e2",
                    color: video.enabled ? "#065f46" : "#991b1b",
                  }}
                >
                  {video.enabled ? "✓ Enabled" : "✗ Disabled"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Meta Information === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/60 hover:shadow-md transition-all">
          <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">
            Created At
          </p>
          <p className="text-sm text-gray-900 font-semibold">
            {formatISODate(video.created_at)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/60 hover:shadow-md transition-all">
          <p className="text-xs font-bold text-purple-700 mb-2 uppercase tracking-wide">
            Last Updated
          </p>
          <p className="text-sm text-gray-900 font-semibold">
            {formatISODate(video.updated_at)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/60 hover:shadow-md transition-all">
          <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Video ID
          </p>
          <p className="text-sm text-gray-900 font-mono font-bold">
            #{video.id}
          </p>
        </div>
      </div>

      {/* === Watch on Provider Button === */}
      <a
        href={video.video_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-6 bg-gradient-to-r bg-red-600 rounded-2xl border border-red-600/50 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 group cursor-pointer"
      >
        <div className="flex items-center gap-3 text-white">
          <Youtube size={20} />
          <span className="text-lg font-bold">
            Watch Full Video on {video.provider_name}
          </span>
        </div>
        <ExternalLink
          size={20}
          className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
        />
      </a>
    </div>
  );
};

export default VideoDetails;

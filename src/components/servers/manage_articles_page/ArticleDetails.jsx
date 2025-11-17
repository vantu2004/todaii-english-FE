import {
  Globe,
  Calendar,
  Link2,
  ExternalLink,
  BookOpen,
  Eye,
  Zap,
  FileText,
  Layers,
  Volume2,
} from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";

// phải truyền riêng paragraphs cho component nây để khi update paragraph, component này render lại
const ArticleDetails = ({ article }) => {
  return (
    <div className="space-y-6 ">
      {/* === Header Section === */}
      <div className="grid grid-cols-2 gap-6 items-stretch">
        {/* Image - Left */}
        <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-white hover:shadow-2xl transition-all">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 text-sm italic">
              No Image
            </div>
          )}
        </div>

        {/* Info - Right */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-3 leading-tight">
              {article.title}
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />
                <span className="font-semibold">
                  {article.author || "Unknown Author"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar size={16} className="text-blue-600 flex-shrink-0" />
                <span className="font-semibold">
                  {formatISODate(article.published_at)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Eye size={16} className="text-blue-600 flex-shrink-0" />
                <span className="font-semibold">{article.views} views</span>
              </div>
            </div>

            {/* CEFR Level */}
            {article.cefr_level && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wide border border-purple-200/50 mb-3">
                <Zap size={13} />
                CEFR: {article.cefr_level}
              </div>
            )}
          </div>

          {/* Source & Status */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-200/50 shadow-sm w-fit">
              <Globe size={14} />
              {article.source_name || "Unknown Source"}
            </div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 ml-2 text-xs font-semibold rounded-full"
              style={{
                backgroundColor: article.enabled ? "#d1fae5" : "#fee2e2",
                color: article.enabled ? "#065f46" : "#991b1b",
              }}
            >
              {article.enabled ? "✓ Enabled" : "✗ Disabled"}
            </div>
          </div>
        </div>
      </div>

      {/* === Description === */}
      {article.description && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200/60 hover:border-blue-300/60 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-100/50 rounded-lg">
              <FileText size={16} className="text-blue-600" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Summary
            </h4>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {article.description}
          </p>
        </div>
      )}

      {/* === Paragraphs (Content) === */}
      {article.paragraphs?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100/50 rounded-lg">
              <BookOpen size={16} className="text-indigo-600" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Content ({article.paragraphs.length} paragraphs)
            </h4>
          </div>
          <div className="space-y-4 pr-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {article.paragraphs.map((p, idx) => (
              <div
                key={p.id}
                className="bg-white rounded-xl p-5 border border-gray-200/60 hover:border-indigo-300/60 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1 break-all">
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      {p.text_en}
                    </p>
                    <p className="text-gray-500 text-xs italic bg-gray-50 p-2 rounded-lg">
                      {p.text_vi_system}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Topics === */}
      {article.topics?.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-2xl p-5 border border-green-200/60">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-green-100/50 rounded-lg">
              <Layers size={16} className="text-green-600" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Topics ({article.topics.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.topics.map((topic) => (
              <div
                key={topic.id}
                className="px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-green-700 border border-green-200/50 shadow-sm"
              >
                <span className="inline-block">
                  {topic.name}
                  {topic.is_deleted && (
                    <span className="ml-1 text-red-500">(Deleted)</span>
                  )}
                  {!topic.enabled && (
                    <span className="ml-1 text-gray-400">(Disabled)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Vocabulary / Dictionary Entries === */}
      {article.entries?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100/50 rounded-lg">
              <BookOpen size={16} className="text-purple-600" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Vocabulary ({article.entries.length} words)
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3 pr-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {article.entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl p-5 border border-purple-200/40 hover:border-purple-300/60 hover:shadow-md transition-all"
              >
                {/* Headword */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-purple-900">
                      {entry.headword}
                    </h5>
                    <p className="text-sm text-purple-600 font-mono">
                      {entry.ipa}
                    </p>
                  </div>
                  {entry.audio_url && (
                    <button
                      onClick={() => new Audio(entry.audio_url).play()}
                      className="flex-shrink-0 p-2.5 rounded-lg text-purple-600 bg-purple-100/50 hover:bg-purple-100 transition-all transform hover:scale-110"
                      title="Play pronunciation"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>

                {/* Senses */}
                <div className="space-y-2">
                  {entry.senses.map((sense, senseIdx) => (
                    <div
                      key={sense.id}
                      className="bg-gray-50 rounded-lg p-3 border-l-2 border-purple-400"
                    >
                      <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1">
                        {sense.pos}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {sense.meaning}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {sense.definition}
                      </p>
                      {sense.example && (
                        <p className="text-xs italic text-gray-700 bg-white p-2 rounded border-l-2 border-yellow-400 mb-2">
                          "{sense.example}"
                        </p>
                      )}

                      {/* Synonyms */}
                      {sense.synonyms?.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            Synonyms:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {sense.synonyms.map((syn, synIdx) => (
                              <span
                                key={synIdx}
                                className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full"
                              >
                                {syn}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Collocations */}
                      {sense.collocations?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            Collocations:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {sense.collocations.map((col, colIdx) => (
                              <span
                                key={colIdx}
                                className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                              >
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Meta Information === */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Created
          </p>
          <p className="text-gray-900 font-medium">
            {formatISODate(article.created_at)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Updated
          </p>
          <p className="text-gray-900 font-medium">
            {formatISODate(article.updated_at)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Article ID
          </p>
          <p className="text-gray-900 font-mono font-medium">#{article.id}</p>
        </div>
      </div>

      {/* === Read Full Article Button === */}
      <a
        href={article.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl border border-blue-600/50 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 group cursor-pointer"
      >
        <div className="flex items-center gap-3 text-white">
          <Link2 size={18} />
          <span className="font-semibold">
            Read Full Article on {article.source_name}
          </span>
        </div>
        <ExternalLink
          size={18}
          className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
        />
      </a>
    </div>
  );
};

export default ArticleDetails;

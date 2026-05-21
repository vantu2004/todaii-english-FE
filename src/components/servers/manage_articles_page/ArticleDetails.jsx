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
import { formatISODate } from "@/utils/FormatDate";

// phải truyền riêng paragraphs cho component nây để khi update paragraph, component này render lại
const ArticleDetails = ({ article }) => {
  return (
    <div className="space-y-6 ">
      {/* === Header Section === */}
      <div className="grid grid-cols-2 gap-6 items-stretch">
        {/* Image - Left */}
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-64 bg-gray-100 text-gray-500 text-sm italic">
              No Image
            </div>
          )}
        </div>

        {/* Info - Right */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-3 leading-tight">
              {article.title}
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
                <span className="font-semibold">
                  {article.author || "Unknown Author"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                <span className="font-semibold">
                  {formatISODate(article.published_at)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Eye size={16} className="text-gray-500 flex-shrink-0" />
                <span className="font-semibold">{article.views} views</span>
              </div>
            </div>

            {/* CEFR Level */}
            {article.cefr_level && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold border border-gray-200 mb-3">
                <Zap size={13} />
                CEFR: {article.cefr_level}
              </div>
            )}
          </div>

          {/* Source & Status */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold border border-gray-200 w-fit">
              <Globe size={14} />
              {article.source_name || "Unknown Source"}
            </div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 ml-2 text-xs font-semibold rounded-md ${
                article.enabled
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {article.enabled ? "✓ Enabled" : "✗ Disabled"}
            </div>
          </div>
        </div>
      </div>

      {/* === Description === */}
      {article.description && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-semibold text-gray-900">Summary</h4>
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
            <h4 className="text-sm font-semibold text-gray-900">
              Content ({article.paragraphs.length} paragraphs)
            </h4>
          </div>
          <div className="space-y-4 pr-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {article.paragraphs.map((p, idx) => (
              <div
                key={p.id}
                className="bg-white rounded-lg p-5 border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-600 text-xs font-semibold">
                    {idx + 1}
                  </span>
                  <div className="flex-1 break-all">
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
                      {p.text_en}
                    </p>
                    <p className="text-gray-500 text-xs italic bg-gray-50 p-2 rounded-lg border border-gray-100">
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
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-semibold text-gray-900">
              Topics ({article.topics.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.topics.map((topic) => (
              <div
                key={topic.id}
                className="px-3 py-1.5 bg-gray-50 rounded-md text-xs font-semibold text-gray-700 border border-gray-200"
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
            <h4 className="text-sm font-semibold text-gray-900">
              Vocabulary ({article.entries.length} words)
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3 pr-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {article.entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg p-5 border border-gray-200"
              >
                {/* Headword */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-gray-900">
                      {entry.headword}
                    </h5>
                    <p className="text-sm text-gray-500 font-mono">
                      {entry.ipa}
                    </p>
                  </div>
                  {entry.audio_url && (
                    <button
                      onClick={() => new Audio(entry.audio_url).play()}
                      className="flex-shrink-0 p-2.5 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-110"
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
                      className="bg-gray-50 rounded-lg p-3 border-l-2 border-gray-300"
                    >
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        {sense.pos}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {sense.meaning}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {sense.definition}
                      </p>
                      {sense.example && (
                        <p className="text-xs italic text-gray-700 bg-white p-2 rounded border-l-2 border-gray-300 mb-2">
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
                                className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-md"
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
                                className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-md"
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
          <p className="font-semibold text-gray-600 mb-1">Created</p>
          <p className="text-gray-900 font-medium">
            {formatISODate(article.created_at)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="font-semibold text-gray-600 mb-1">Updated</p>
          <p className="text-gray-900 font-medium">
            {formatISODate(article.updated_at)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="font-semibold text-gray-600 mb-1">Article ID</p>
          <p className="text-gray-900 font-mono font-medium">#{article.id}</p>
        </div>
      </div>

      {/* === Read Full Article Button === */}
      <a
        href={article.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-5 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all group cursor-pointer"
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

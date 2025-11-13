import {
  Globe,
  Calendar,
  Link2,
  Eye,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import Modal from "../Modal";
import { formatDate } from "../../../utils/FormatDate";

const ArticleViewModal = ({ isOpen, onClose, article }) => {
  if (!article) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
            <Eye className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Article Details</h2>
            <p className="text-sm text-gray-500">View article information</p>
          </div>
        </div>
      }
      width="sm:max-w-4xl"
    >
      <div className="space-y-6">
        {/* === Header Section === */}
        <div className="grid grid-cols-2 gap-6 items-stretch">
          {/* Image - Left Side */}
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-white hover:shadow-2xl transition-all">
            {article.url_to_image ? (
              <img
                src={article.url_to_image}
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 text-sm italic">
                No Image
              </div>
            )}
          </div>

          {/* Info - Right Side */}
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
                    {formatDate(article.published_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Source */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-200/50 shadow-sm w-fit">
              <Globe size={14} />
              {article.source?.name || "Unknown Source"}
            </div>
          </div>
        </div>

        {/* === Description === */}
        {article.description && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200/60 hover:border-blue-300/60 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100/50 rounded-lg">
                <BookOpen size={16} className="text-blue-600" />
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

        {/* === Content === */}
        {article.content && (
          <div className="bg-gradient-to-br from-slate-50/50 to-gray-50/50 rounded-2xl p-6 border border-gray-200/60 hover:border-blue-300/60 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-100/50 rounded-lg">
                <Eye size={16} className="text-indigo-600" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Full Content
              </h4>
            </div>
            <div className="max-h-64 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                {article.content}
              </p>
            </div>
          </div>
        )}

        {/* === Stats Row === */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-xl p-4 border border-purple-200/40">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
              Author
            </p>
            <p className="text-sm font-medium text-purple-900 truncate">
              {article.author || "Unknown"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl p-4 border border-green-200/40">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
              Published
            </p>
            <p className="text-sm font-medium text-green-900">
              {formatDate(article.published_at)}
            </p>
          </div>
        </div>

        {/* === Link Section === */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl border border-blue-600/50 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 group cursor-pointer"
        >
          <div className="flex items-center gap-3 text-white">
            <Link2 size={18} />
            <span className="font-semibold">Read Full Article</span>
          </div>
          <ExternalLink
            size={18}
            className="text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          />
        </a>
      </div>
    </Modal>
  );
};

export default ArticleViewModal;

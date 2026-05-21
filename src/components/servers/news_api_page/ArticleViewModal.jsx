import {
  Globe,
  Calendar,
  Link2,
  Eye,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import Modal from "@/components/servers/Modal";
import { formatISODate } from "@/utils/FormatDate";

const ArticleViewModal = ({ isOpen, onClose, article }) => {
  if (!article) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-lg font-semibold text-gray-900">Article Details</h2>
      }
      width="sm:max-w-4xl"
    >
      <div className="space-y-6">
        {/* === Header Section === */}
        <div className="grid grid-cols-2 gap-6 items-stretch">
          {/* Image - Left Side */}
          <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            {article.url_to_image ? (
              <img
                src={article.url_to_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-64 text-gray-500 text-sm">
                No Image
              </div>
            )}
          </div>

          {/* Info - Right Side */}
          <div className="border border-gray-200 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-3 leading-tight">
                {article.title}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Author:</span>
                  <span className="font-medium text-gray-900">
                    {article.author || "Unknown"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-gray-900">
                    {formatISODate(article.published_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Source */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium w-fit">
              <Globe size={14} />
              {article.source?.name || "Unknown Source"}
            </div>
          </div>
        </div>

        {/* === Description === */}
        {article.description && (
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Summary</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {article.description}
            </p>
          </div>
        )}

        {/* === Content === */}
        {article.content && (
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Full Content
            </h4>
            <div className="max-h-64 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300">
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
                {article.content}
              </p>
            </div>
          </div>
        )}

        {/* === Stats Row === */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Author</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {article.author || "Unknown"}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Published</p>
            <p className="text-sm font-medium text-gray-900">
              {formatISODate(article.published_at)}
            </p>
          </div>
        </div>

        {/* === Link Section === */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Link2 size={18} />
            <span className="font-medium text-sm">Read Full Article</span>
          </div>
          <ExternalLink
            size={18}
            className="text-gray-400 group-hover:text-white transition-colors"
          />
        </a>
      </div>
    </Modal>
  );
};

export default ArticleViewModal;

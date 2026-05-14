import { Eye } from "lucide-react";
import Modal from "@/components/servers/Modal";
import ArticleDetails from "./ArticleDetails";

const ArticleViewModal = ({ isOpen, onClose, article }) => {
  if (!article) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Article Details
            </h2>
          </div>
        </div>
      }
      width="sm:max-w-7xl"
    >
      <ArticleDetails article={article} paragraphs={article.paragraphs} />
    </Modal>
  );
};

export default ArticleViewModal;

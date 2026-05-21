import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  saveParagraph,
  translateByGemini,
  deleteParagraph,
} from "@/api/servers/paragraphApi";
import ParagraphForm from "./ParagraphForm";
import { logError } from "@/utils/LogError";
import { Plus, FileText, AlertCircle } from "lucide-react";

const ListParagraphs = ({ articleId, paragraphs }) => {
  const [localParagraphs, setLocalParagraphs] = useState([]);

  useEffect(() => {
    setLocalParagraphs(paragraphs || []);
  }, [paragraphs]);

  const handleSaveParagraph = async (paragraph) => {
    try {
      let savedParagraph = await saveParagraph(articleId, paragraph);

      if (paragraph.id) {
        setLocalParagraphs((prev) =>
          prev.map((p) => (p.id === paragraph.id ? savedParagraph : p)),
        );
        toast.success("Updated successfully.");
      } else {
        setLocalParagraphs((prev) => [
          ...prev.filter((p) => p.id !== null),
          savedParagraph,
        ]);
        toast.success("Created successfully.");
      }
    } catch (error) {
      logError(error);
    }
  };

  const handleTranslateByGemini = async (textEn) => {
    try {
      const textVi = await translateByGemini(textEn);
      toast.success("Translated successfully.");
      return textVi;
    } catch (error) {
      logError(error);
    }
  };

  const handleDeleteParagraph = async (paragraphId) => {
    try {
      await deleteParagraph(paragraphId);
      toast.success("Deleted successfully.");
      setLocalParagraphs((prev) => prev.filter((p) => p.id !== paragraphId));
    } catch (error) {
      logError(error);
    }
  };

  const handleAddParagraph = () => {
    const hasUnsaved = localParagraphs.some((p) => p.id === null);
    if (hasUnsaved) {
      toast.error("Please save the new paragraph before adding another.");
      return;
    }

    const newParagraph = {
      // mỗi lần paragraphs được cập nhật là list bị re-render lại 1 lần, React dựa vào key trong list để trả về đúng thông tin => cần tempId để khi re-render ko bị mất dữ liệu
      tempId: Math.random(),

      id: null,
      para_order: localParagraphs.length + 1,
      text_en: "",
      text_vi_system: "",
    };

    setLocalParagraphs((prev) => [...prev, newParagraph]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Paragraphs</h2>
        <p className="text-sm text-gray-500 mt-1">
          {localParagraphs.length}{" "}
          {localParagraphs.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Empty State */}
      {localParagraphs.length === 0 && (
        <div className="mb-6 p-8 rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-gray-600 font-medium mb-1">No paragraphs yet</p>
            <p className="text-gray-500 text-sm">
              Start by adding your first paragraph
            </p>
          </div>
        </div>
      )}

      {/* List Paragraph Forms */}
      <div className="space-y-4 mb-6">
        {localParagraphs.map((p, idx) => (
          <div
            key={p.id ? p.id : p.tempId}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <ParagraphForm
              paragraph={p}
              onSave={handleSaveParagraph}
              onTranslate={handleTranslateByGemini}
              onDelete={p.id ? handleDeleteParagraph : null}
            />
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={handleAddParagraph}
        className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Add New Paragraph
      </button>
    </div>
  );
};

export default ListParagraphs;

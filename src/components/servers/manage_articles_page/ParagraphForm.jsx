import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  saveParagraph,
  translateByGemini,
  deleteParagraph,
} from "../../../api/servers/paragraphApi";
import { Trash2, Plus, Check, Languages } from "lucide-react";

const ParagraphForm = ({ articleId, paragraphs }) => {
  const [localParagraphs, setLocalParagraphs] = useState([]);
  const [loadingPara, setLoadingPara] = useState(null);
  const textareaRefs = useRef({});

  // Load paragraphs from props
  useEffect(() => {
    setLocalParagraphs(paragraphs || []);
  }, [paragraphs]);

  // Auto-resize textareas
  useEffect(() => {
    localParagraphs.forEach((para, idx) => {
      const refEn = textareaRefs.current[`en-${idx}`];
      const refVi = textareaRefs.current[`vi-${idx}`];
      if (refEn) {
        refEn.style.height = "auto";
        refEn.style.height = refEn.scrollHeight + "px";
      }
      if (refVi) {
        refVi.style.height = "auto";
        refVi.style.height = refVi.scrollHeight + "px";
      }
    });
  }, [localParagraphs]);

  const addParagraph = () => {
    if (localParagraphs.some((p) => p.id === null)) {
      toast.error("Please save the new paragraph before adding another");
      return;
    }

    const newPara = {
      id: null,
      para_order: localParagraphs.length + 1,
      text_en: "",
      text_vi_system: "",
    };
    setLocalParagraphs([...localParagraphs, newPara]);
  };

  const updateParagraph = (para, field, value) => {
    setLocalParagraphs((prev) =>
      prev.map((p) =>
        p.para_order === para.para_order ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSave = async (para) => {
    if (!para.text_en.trim()) {
      toast.error("English text is required");
      return;
    }
    try {
      const saved = await saveParagraph(articleId, para);
      setLocalParagraphs((prev) =>
        prev.map((p) => (p.para_order === para.para_order ? { ...saved } : p))
      );
      toast.success(`Paragraph ${para.para_order} saved`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save paragraph");
    }
  };

  const handleTranslate = async (para) => {
    if (!para.text_en.trim()) {
      toast.error("Please enter English text first");
      return;
    }
    setLoadingPara(para.para_order);
    try {
      const translated = await translateByGemini(para.text_en);
      setLocalParagraphs((prev) =>
        prev.map((p) =>
          p.para_order === para.para_order
            ? { ...p, text_vi_system: translated }
            : p
        )
      );
      toast.success(`Paragraph ${para.para_order} translated`);
    } catch (err) {
      console.error(err);
      toast.error("Translation failed");
    } finally {
      setLoadingPara(null);
    }
  };

  const handleDelete = async (para) => {
    try {
      if (para.id) await deleteParagraph(para.id);

      setLocalParagraphs((prev) =>
        prev
          .filter((p) => p.para_order !== para.para_order)
          .map((p, idx) => ({ ...p, para_order: idx + 1 }))
      );

      toast.success(`Paragraph ${para.para_order} deleted`);
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Paragraphs</h2>
          <p className="text-slate-600">
            Manage your article content with translations
          </p>
        </div>

        <div className="space-y-4">
          {localParagraphs.length === 0 ? (
            <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
              <p className="text-slate-500 text-lg mb-4">No paragraphs yet</p>
              <p className="text-slate-400">Add one below to get started</p>
            </div>
          ) : (
            localParagraphs.map((para, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden"
              >
                <div className="bg-blue-50 px-6 py-4 flex justify-between items-center border-b border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-semibold text-sm">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-700">
                      Paragraph {idx + 1}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(para)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      🇬🇧 English Text
                    </label>
                    <textarea
                      ref={(el) => (textareaRefs.current[`en-${idx}`] = el)}
                      value={para.text_en}
                      onChange={(e) =>
                        updateParagraph(para, "text_en", e.target.value)
                      }
                      placeholder="Enter English text here..."
                      className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      🇻🇳 Vietnamese Translation
                    </label>
                    <textarea
                      ref={(el) => (textareaRefs.current[`vi-${idx}`] = el)}
                      value={para.text_vi_system}
                      onChange={(e) =>
                        updateParagraph(para, "text_vi_system", e.target.value)
                      }
                      placeholder="Vietnamese translation will appear here..."
                      className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 resize-none overflow-hidden"
                    />
                  </div>

                  <div className="flex gap-2 pt-2 justify-end">
                    <button
                      onClick={() => handleTranslate(para)}
                      disabled={loadingPara === para.para_order}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                    >
                      {loadingPara === para.para_order ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Languages size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => handleSave(para)}
                      className="p-2 rounded-lg text-green-700 hover:bg-slate-200"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={addParagraph}
          className="w-full mt-6 py-3 bg-blue-100 text-black rounded-lg font-semibold hover:bg-blue-200 flex items-center justify-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Add New Paragraph
        </button>
      </div>
    </div>
  );
};

export default ParagraphForm;

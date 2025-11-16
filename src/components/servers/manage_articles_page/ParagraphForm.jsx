import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Save, Trash2, Languages } from "lucide-react";

const ParagraphForm = ({ paragraph, onSave, onTranslate, onDelete }) => {
  const [form, setForm] = useState({
    id: "",
    para_order: "",
    text_en: "",
    text_vi_system: "",
  });

  const [translateLoading, setTranslateLoading] = useState(false);
  const enRef = useRef(null);
  const viRef = useRef(null);

  // Set form lần đầu render
  useEffect(() => {
    if (paragraph) {
      setForm(paragraph);
      setTimeout(() => adjustHeight(), 0); // scale textarea lần đầu
    }
  }, [paragraph]);

  // Hàm scale textarea
  const adjustHeight = () => {
    [enRef.current, viRef.current].forEach((ta) => {
      if (ta) {
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + 10 + "px";
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTranslate = async () => {
    setTranslateLoading(true);
    const vi = await onTranslate(form.text_en);
    setTranslateLoading(false);
    if (vi) {
      setForm((prev) => ({
        ...prev,
        text_vi_system: vi,
      }));
      setTimeout(() => adjustHeight(), 0);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-5 shadow-lg">
      {/* Header với Delete button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {form.id ? `Paragraph with ID ${form.id}` : "New Paragraph"}
        </h3>
        {onDelete && (
          <button
            onClick={() => onDelete(form.id)}
            className="p-2 hover:bg-red-100/50 text-red-600 hover:text-red-700 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Order */}
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
          Order
        </label>
        <input
          type="number"
          name="para_order"
          value={form.para_order}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all text-sm"
        />
      </div>

      {/* English Text */}
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
          English Text
        </label>
        <textarea
          ref={enRef}
          name="text_en"
          value={form.text_en}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all resize-none text-sm leading-relaxed"
          onInput={adjustHeight}
        ></textarea>
      </div>

      {/* Vietnamese (System) */}
      <div>
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
          Vietnamese (System)
        </label>
        <textarea
          ref={viRef}
          name="text_vi_system"
          value={form.text_vi_system}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all resize-none text-sm leading-relaxed"
          onInput={adjustHeight}
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200/50">
        <button
          onClick={handleTranslate}
          disabled={translateLoading}
          className="p-2.5 hover:bg-emerald-100/50 text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          title={translateLoading ? "Translating..." : "Translate"}
        >
          <Languages size={20} />
        </button>

        <button
          onClick={() => onSave(form)}
          className="p-2.5 hover:bg-blue-100/50 text-blue-600 hover:text-blue-700 rounded-lg transition-colors"
          title="Save"
        >
          <Save size={20} />
        </button>
      </div>
    </div>
  );
};

export default ParagraphForm;

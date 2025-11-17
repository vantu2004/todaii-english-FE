import { useEffect, useState } from "react";
import Modal from "../Modal";
import { Music, Clock, Type } from "lucide-react";

const LyricFormModal = ({
  isOpen,
  onClose,
  mode = "create",
  initialData = {},
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    line_order: "",
    start_ms: "",
    end_ms: "",
    text_en: "",
    text_vi: "",
  });

  const isCreate = mode === "create";

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        line_order: initialData.line_order || "",
        start_ms: initialData.start_ms || "",
        end_ms: initialData.end_ms || "",
        text_en: initialData.text_en || "",
        text_vi: initialData.text_vi || "",
      });
    } else {
      setFormData({
        line_order: "",
        start_ms: "",
        end_ms: "",
        text_en: "",
        text_vi: "",
      });
    }
  }, [initialData]);

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div
            className={`p-2 bg-gradient-to-br ${
              isCreate
                ? "from-green-500 to-emerald-600"
                : "from-blue-500 to-indigo-600"
            } rounded-lg`}
          >
            <Music className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isCreate ? "Create Lyric Line" : "Update Lyric Line"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isCreate ? "Add a new lyric line" : "Modify lyric line details"}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className={`px-5 py-2.5 bg-gradient-to-r ${
              isCreate
                ? "from-green-600 to-emerald-600"
                : "from-blue-600 to-indigo-600"
            } text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105`}
          >
            {isCreate ? "Create Lyric" : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Line Order */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type size={16} className="text-blue-600" />
            Line Order <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.line_order}
            onChange={(e) => updateField("line_order", Number(e.target.value))}
            placeholder="1"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>

        {/* Start ms */}
        <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Clock size={16} className="text-purple-600" />
            Start (ms) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.start_ms}
            onChange={(e) => updateField("start_ms", Number(e.target.value))}
            placeholder="0"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          />
        </div>

        {/* End ms */}
        <div className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-2xl p-6 border border-orange-200/50 hover:border-orange-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Clock size={16} className="text-orange-600" />
            End (ms) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.end_ms}
            onChange={(e) => updateField("end_ms", Number(e.target.value))}
            placeholder="3000"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          />
        </div>

        {/* English Text */}
        <div className="bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl p-6 border border-green-200/50 hover:border-green-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type size={16} className="text-green-600" />
            English Text <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.text_en}
            onChange={(e) => updateField("text_en", e.target.value)}
            placeholder="Enter English lyrics..."
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-y"
          />
        </div>

        {/* Vietnamese Text */}
        <div className="bg-gradient-to-br from-slate-50 to-pink-50 rounded-2xl p-6 border border-pink-200/50 hover:border-pink-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type size={16} className="text-pink-600" />
            Vietnamese Text <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.text_vi}
            onChange={(e) => updateField("text_vi", e.target.value)}
            placeholder="Nhập lời Việt..."
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-y"
          />
        </div>
      </div>
    </Modal>
  );
};

export default LyricFormModal;

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
  const primaryColor = isCreate ? "blue" : "yellow";

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
            className={`p-2 rounded-lg ${
              isCreate ? "bg-blue-600" : "bg-yellow-500"
            }`}
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
            className={`px-5 py-2.5 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 ${
              isCreate
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isCreate ? "Create Lyric" : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Line Order */}
        <div
          className={`bg-${primaryColor}-50 rounded-2xl p-6 hover:border-${primaryColor}-300 hover:shadow-md transition-all`}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type size={16} className={`text-${primaryColor}-600`} />
            Line Order <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.line_order}
            onChange={(e) => updateField("line_order", Number(e.target.value))}
            placeholder="1"
            className={`w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-${primaryColor}-500 focus:ring-2 focus:ring-${primaryColor}-200 outline-none transition-all`}
          />
        </div>

        {/* Start ms */}
        <div
          className={`bg-${primaryColor}-50 rounded-2xl p-6 hover:border-${primaryColor}-300 hover:shadow-md transition-all`}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Clock size={16} className={`text-${primaryColor}-600`} />
            Start (ms) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.start_ms}
            onChange={(e) => updateField("start_ms", Number(e.target.value))}
            placeholder="0"
            className={`w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-${primaryColor}-500 focus:ring-2 focus:ring-${primaryColor}-200 outline-none transition-all`}
          />
        </div>

        {/* End ms */}
        <div
          className={`bg-${primaryColor}-50 rounded-2xl p-6 hover:border-${primaryColor}-300 hover:shadow-md transition-all`}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Clock size={16} className={`text-${primaryColor}-600`} />
            End (ms) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.end_ms}
            onChange={(e) => updateField("end_ms", Number(e.target.value))}
            placeholder="3000"
            className={`w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-${primaryColor}-500 focus:ring-2 focus:ring-${primaryColor}-200 outline-none transition-all`}
          />
        </div>

        {/* English Text */}
        <div
          className={`bg-${primaryColor}-50 rounded-2xl p-6 hover:border-${primaryColor}-300 hover:shadow-md transition-all`}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type size={16} className={`text-${primaryColor}-600`} />
            English Text <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.text_en}
            onChange={(e) => updateField("text_en", e.target.value)}
            placeholder="Enter English lyrics..."
            className={`w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-${primaryColor}-500 focus:ring-2 focus:ring-${primaryColor}-200 outline-none transition-all resize-y`}
          />
        </div>

        {/* Vietnamese Text */}
        <div
          className={`bg-${primaryColor}-50 rounded-2xl p-6 hover:border-${primaryColor}-300 hover:shadow-md transition-all`}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Type size={16} className={`text-${primaryColor}-600`} />
            Vietnamese Text <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.text_vi}
            onChange={(e) => updateField("text_vi", e.target.value)}
            placeholder="Nhập lời Việt..."
            className={`w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-${primaryColor}-500 focus:ring-2 focus:ring-${primaryColor}-200 outline-none transition-all resize-y`}
          />
        </div>
      </div>
    </Modal>
  );
};

export default LyricFormModal;

import { useEffect, useState } from "react";
import Modal from "@/components/servers/Modal";
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
        <h2 className="text-lg font-semibold text-gray-900">
          {isCreate ? "Create Lyric Line" : "Update Lyric Line"}
        </h2>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
          >
            {isCreate ? "Create Lyric" : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Line Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Line Order <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.line_order}
            onChange={(e) => updateField("line_order", Number(e.target.value))}
            placeholder="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 outline-none transition-all"
          />
        </div>

        {/* Start ms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start (ms) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.start_ms}
            onChange={(e) => updateField("start_ms", Number(e.target.value))}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 outline-none transition-all"
          />
        </div>

        {/* End ms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End (ms) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.end_ms}
            onChange={(e) => updateField("end_ms", Number(e.target.value))}
            placeholder="3000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 outline-none transition-all"
          />
        </div>

        {/* English Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            English Text <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.text_en}
            onChange={(e) => updateField("text_en", e.target.value)}
            placeholder="Enter English lyrics..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 outline-none transition-all resize-y"
          />
        </div>

        {/* Vietnamese Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vietnamese Text <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.text_vi}
            onChange={(e) => updateField("text_vi", e.target.value)}
            placeholder="Nhập lời Việt..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 outline-none transition-all resize-y"
          />
        </div>
      </div>
    </Modal>
  );
};

export default LyricFormModal;

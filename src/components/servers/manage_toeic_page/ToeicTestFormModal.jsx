import { useState, useEffect } from "react";
import Modal from "../Modal";
import { FileText, Type, Clock, Image, FileAudio, LayoutList, Layers, ToggleLeft } from "lucide-react";
import { fetchToeicCollections } from "../../../api/servers/toeicCollectionApi";

const ToeicTestFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    test_type: "TOEIC_LR",
    duration: 120,
    audio_url: "",
    thumbnail: "",
    description: "",
    status: "DRAFT",
    collection_id: "",
  });

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch collections for dropdown
      fetchToeicCollections(1, 1000).then((data) => {
        setCollections(data.content || []);
      }).catch(err => console.error("Error fetching collections for dropdown", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        test_type: initialData.test_type || "TOEIC_LR",
        duration: initialData.duration || 120,
        audio_url: initialData.audio_url || "",
        thumbnail: initialData.thumbnail || "",
        description: initialData.description || "",
        status: initialData.status || "DRAFT",
        collection_id: initialData.collection?.id || "",
      });
    } else {
      setFormData({
        title: "",
        test_type: "TOEIC_LR",
        duration: 120,
        audio_url: "",
        thumbnail: "",
        description: "",
        status: "DRAFT",
        collection_id: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      collection_id: formData.collection_id ? Number(formData.collection_id) : null
    };
    onSubmit(submitData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
            <FileText className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {initialData ? "Edit Test" : "Create Test"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your TOEIC test details
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
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            {initialData ? "Update Test" : "Create Test"}
          </button>
        </div>
      }
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300 transition-all space-y-4">

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              <Type size={16} className="text-blue-600" />
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., ETS 2024 Test 1"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                <LayoutList size={16} className="text-blue-600" />
                Test Type
              </label>
              <select
                name="testType"
                value={formData.testType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              >
                <option value="TOEIC_LR">TOEIC LR</option>
                <option value="TOEIC_SW">TOEIC SW</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                <Clock size={16} className="text-blue-600" />
                Duration (mins)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              <Layers size={16} className="text-blue-600" />
              Collection
            </label>
            <select
              name="collection_id"
              value={formData.collection_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            >
              <option value="">-- Select a Collection --</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              <Image size={16} className="text-blue-600" />
              Thumbnail URL
            </label>
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/thumbnail.jpg"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              <FileAudio size={16} className="text-blue-600" />
              Audio URL
            </label>
            <input
              type="text"
              name="audio_url"
              value={formData.audio_url}
              onChange={handleChange}
              placeholder="https://example.com/audio.mp3"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              <ToggleLeft size={16} className="text-blue-600" />
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              <FileText size={16} className="text-blue-600" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe this test..."
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
            />
          </div>

        </div>
      </div>
    </Modal>
  );
};

export default ToeicTestFormModal;

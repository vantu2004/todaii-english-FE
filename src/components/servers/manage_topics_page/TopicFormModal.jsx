import { useState } from "react";
import Modal from "../Modal";
import { FolderPlus, Tag, FileText, Video, Lightbulb } from "lucide-react";

const TopicFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    topicType: "ARTICLE",
  });

  const topicTypes = [
    {
      value: "ARTICLE",
      label: "Article",
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
      description: "Text-based content and articles",
    },
    {
      value: "VIDEO",
      label: "Video",
      icon: Video,
      color: "from-purple-500 to-pink-600",
      description: "Video content and tutorials",
    },
  ];

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
            <FolderPlus className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Topic
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Add a new content topic to organize materials
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
            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            Create Topic
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Topic Name */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            <Tag size={16} className="text-blue-600" />
            Topic Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="e.g., World News, Technology, Science"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          <p className="text-xs text-gray-600 mt-2.5">
            Choose a clear, descriptive name for your topic
          </p>
        </div>

        {/* Topic Type Selection */}
        <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
            <FolderPlus size={16} className="text-purple-600" />
            Topic Type
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-600 mb-4">
            Select the content type for this topic
          </p>

          <div className="grid grid-cols-2 gap-3">
            {topicTypes.map((type) => {
              const isSelected = formData.topicType === type.value;
              const Icon = type.icon;

              return (
                <label
                  key={type.value}
                  className={`relative flex flex-col items-center p-5 border-2 rounded-xl cursor-pointer transition-all transform ${
                    isSelected
                      ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-lg hover:shadow-xl scale-[1.02]`
                      : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md"
                  }`}
                >
                  <input
                    type="radio"
                    name="topicType"
                    value={type.value}
                    checked={isSelected}
                    onChange={(e) => updateField("topicType", e.target.value)}
                    className="hidden"
                  />

                  <div
                    className={`p-3 rounded-lg mb-2 ${
                      isSelected ? "bg-white/20" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      size={28}
                      className={isSelected ? "text-white" : "text-gray-600"}
                    />
                  </div>

                  <div
                    className={`font-bold text-sm mb-1 ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {type.label}
                  </div>

                  <div
                    className={`text-xs text-center ${
                      isSelected ? "text-white/90" : "text-gray-500"
                    }`}
                  >
                    {type.description}
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full"></div>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Info Notice */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 p-5 rounded-lg hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0 mt-0.5">
              <Lightbulb size={16} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900 mb-1 uppercase tracking-wide">
                Topic Organization
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                Topics help categorize and organize your content. Choose
                meaningful names that reflect the subject matter for easy
                navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TopicFormModal;

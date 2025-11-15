import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchTopicsNoPaged } from "../../../api/servers/topicApi";
import { ChevronDown } from "lucide-react";
import { logError } from "../../../utils/LogError";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const ArticleForm = ({ mode = "create", initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    source_id: initialData.source_id || "",
    source_name: initialData.source_name || "",
    author: initialData.author || "",
    title: initialData.title || "",
    description: initialData.description || "",
    source_url: initialData.source_url || "",
    image_url: initialData.image_url || "",
    published_at: initialData.published_at
      ? initialData.published_at.slice(0, 16)
      : "",
    cefr_level: initialData.cefr_level || "A1",
    topic_ids:
      initialData.topic_ids || initialData.topics?.map((t) => t.id) || [],
  });

  const [topics, setTopics] = useState([]);
  const [expandedSection, setExpandedSection] = useState("title");

  const handleFetchTopics = async () => {
    try {
      const data = await fetchTopicsNoPaged("ARTICLE");
      setTopics(data || []);
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    handleFetchTopics();
  }, []);

  // auto-fill khi initialData đổi
  useEffect(() => {
    setFormData({
      source_id: initialData.source_id || "",
      source_name: initialData.source_name || "",
      author: initialData.author || "",
      title: initialData.title || "",
      description: initialData.description || "",
      source_url: initialData.source_url || "",
      image_url: initialData.image_url || "",
      published_at: initialData.published_at
        ? initialData.published_at.slice(0, 16)
        : "",
      cefr_level: initialData.cefr_level || "A1",
      topic_ids:
        initialData.topic_ids || initialData.topics?.map((t) => t.id) || [],
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTopic = (id) => {
    setFormData((prev) => ({
      ...prev,
      topic_ids: prev.topic_ids.includes(id)
        ? prev.topic_ids.filter((t) => t !== id)
        : [...prev.topic_ids, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...initialData,
      ...formData,
      topic_ids: formData.topic_ids,
    };
    onSubmit(payload);
  };

  const sections = [
    {
      id: "title",
      title: "Article Title",
      fields: [{ label: "Title", name: "title", required: true, type: "text" }],
    },
    {
      id: "source",
      title: "Source Information",
      fields: [
        {
          label: "Source Name",
          name: "source_name",
          required: true,
          type: "text",
        },
        { label: "Source ID", name: "source_id", type: "text" },
        {
          label: "Source URL",
          name: "source_url",
          required: true,
          type: "text",
        },
      ],
    },
    {
      id: "author",
      title: "Author Information",
      fields: [
        { label: "Author Name", name: "author", required: true, type: "text" },
      ],
    },
    {
      id: "media",
      title: "Media & Description",
      fields: [
        { label: "Image URL", name: "image_url", type: "text" },
        {
          label: "Description",
          name: "description",
          required: true,
          type: "textarea",
        },
      ],
    },
    {
      id: "meta",
      title: "Metadata",
      fields: [
        {
          label: "Published At",
          name: "published_at",
          required: true,
          type: "datetime",
        },
        {
          label: "CEFR Level",
          name: "cefr_level",
          required: true,
          type: "select",
          options: CEFR_LEVELS,
        },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Form Sections */}
          <div className="lg:col-span-2 space-y-3">
            {sections.map((section, idx) => {
              const isExpanded = expandedSection === section.id;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Header */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSection(isExpanded ? null : section.id)
                    }
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {section.title}
                    </h3>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="text-gray-600" size={18} />
                    </motion.div>
                  </button>

                  {/* Content */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-4 space-y-4 border-t border-gray-200">
                      {section.fields.map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>

                          {field.type === "textarea" ? (
                            <textarea
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              required={field.required}
                              rows={field.name === "description" ? 5 : 4}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : field.type === "select" ? (
                            <select
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {field.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : field.type === "datetime" ? (
                            <input
                              type="datetime-local"
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              required={field.required}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              required={field.required}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          )}

                          {/* Image Preview */}
                          {field.name === "image_url" && formData.image_url && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-3 rounded overflow-hidden border border-gray-200"
                            >
                              <img
                                src={formData.image_url}
                                alt="Preview"
                                className="w-full h-auto object-cover"
                              />
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: Topics */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-4 sticky top-8">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">
                Topics
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                {formData.topic_ids.length} selected
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {topics.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Loading...
                  </p>
                ) : (
                  topics.map((topic) => (
                    <label
                      key={topic.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.topic_ids.includes(topic.id)}
                        onChange={() => toggleTopic(topic.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {topic.name}
                      </span>
                    </label>
                  ))
                )}
              </div>

              {/* Selected Topics */}
              {formData.topic_ids.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Selected:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topics
                      .filter((t) => formData.topic_ids.includes(t.id))
                      .map((topic) => (
                        <span
                          key={topic.id}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {topic.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-8 py-4 flex justify-end items-center gap-3">
        {/* Cancel button */}
        <button
          type="button"
          onClick={() => window.history.back()} // quay lại trang trước
          className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 active:scale-95 transition-all shadow-sm"
        >
          Cancel
        </button>

        {/* Submit button */}
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
        >
          {mode === "create" ? "Create Article" : "Update Article"}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;

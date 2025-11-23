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
      icon: "📝",
      fields: [{ label: "Title", name: "title", required: true, type: "text" }],
    },
    {
      id: "source",
      title: "Source Information",
      icon: "🔗",
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
      icon: "✍️",
      fields: [
        { label: "Author Name", name: "author", required: true, type: "text" },
      ],
    },
    {
      id: "media",
      title: "Media & Description",
      icon: "🖼️",
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
      icon: "⚙️",
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-slate-50"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-b-lg px-8 py-3 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {mode === "create" ? "Add New Article" : "Update Article"}
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            {mode === "create"
              ? "Fill in the details to create a new article entry"
              : "Modify article details and update content information"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
            {mode === "create" ? "New" : "Updating"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Form Sections */}
          <div className="lg:col-span-2 space-y-4">
            {sections.map((section, idx) => {
              const isExpanded = expandedSection === section.id;

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSection(isExpanded ? null : section.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-white transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{section.icon}</span>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {section.title}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown
                        className="text-slate-400 group-hover:text-slate-600"
                        size={20}
                      />
                    </motion.div>
                  </button>

                  {/* Content */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-slate-100"
                  >
                    <div className="px-6 py-4 space-y-5">
                      {section.fields.map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                              placeholder="Enter content..."
                              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                            />
                          ) : field.type === "select" ? (
                            <select
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              required={field.required}
                              placeholder={`Enter ${field.label.toLowerCase()}...`}
                              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                          )}

                          {/* Image Preview */}
                          {field.name === "image_url" && formData.image_url && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-4 rounded-lg overflow-hidden border border-slate-200 shadow-md bg-white p-2"
                            >
                              <img
                                src={formData.image_url}
                                alt="Preview"
                                className="w-full h-full object-cover rounded"
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200 rounded-xl p-6 sticky top-8 shadow-md"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
                <h3 className="font-bold text-slate-900">
                  Topics <span className="text-red-500">*</span>
                </h3>
              </div>

              <p className="text-xs text-slate-500 mb-4 font-medium">
                {formData.topic_ids.length} of {topics.length} selected
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {topics.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Loading...
                  </p>
                ) : (
                  topics.map((topic) => (
                    <motion.label
                      key={topic.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.topic_ids.includes(topic.id)}
                        onChange={() => toggleTopic(topic.id)}
                        className="w-5 h-5 rounded border-slate-300 cursor-pointer appearance-none bg-white border transition-all"
                        style={{
                          backgroundImage: formData.topic_ids.includes(topic.id)
                            ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.207 5.207L6.5 11.914 2.793 8.207'/%3E%3C/svg%3E")`
                            : "none",
                          backgroundColor: formData.topic_ids.includes(topic.id)
                            ? "#059669"
                            : "white",
                          borderColor: formData.topic_ids.includes(topic.id)
                            ? "#059669"
                            : "#cbd5e1",
                        }}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {topic.name}
                      </span>
                    </motion.label>
                  ))
                )}
              </div>

              {/* Selected Topics */}
              {formData.topic_ids.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 pt-4 border-t border-slate-200"
                >
                  <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">
                    Selected Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topics
                      .filter((t) => formData.topic_ids.includes(t.id))
                      .map((topic) => (
                        <motion.span
                          key={topic.id}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 rounded-full border border-emerald-200"
                        >
                          {topic.name}
                        </motion.span>
                      ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white px-8 py-4 flex justify-end gap-3 shadow-lg">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:shadow-lg hover:scale-105 transition-all active:scale-95 shadow-md"
        >
          {mode === "create" ? "Create Article" : "Update Article"}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;

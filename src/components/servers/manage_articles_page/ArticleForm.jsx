import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchTopicsNoPaged } from "@/api/servers/topicApi";
import {
  ChevronDown,
  Clock4,
  Image,
  Newspaper,
  SquareCode,
  User,
} from "lucide-react";
import { logError } from "@/utils/LogError";

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
      icon: <Newspaper />,
      fields: [{ label: "Title", name: "title", required: true, type: "text" }],
    },
    {
      id: "source",
      title: "Source Information",
      icon: <SquareCode />,
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
      icon: <User />,
      fields: [
        { label: "Author Name", name: "author", required: true, type: "text" },
      ],
    },
    {
      id: "media",
      title: "Media & Description",
      icon: <Image />,
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
      icon: <Clock4 />,
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
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4">
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
          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700">
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
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Header */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSection(isExpanded ? null : section.id)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{section.icon}</span>
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {section.title}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown
                        className="text-gray-400 group-hover:text-gray-600"
                        size={20}
                      />
                    </motion.div>
                  </button>

                  {/* Content */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-gray-100"
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
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all resize-none"
                            />
                          ) : field.type === "select" ? (
                            <select
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
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
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                            />
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              required={field.required}
                              placeholder={`Enter ${field.label.toLowerCase()}...`}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                            />
                          )}

                          {/* Image Preview */}
                          {field.name === "image_url" && formData.image_url && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white p-2"
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
              className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-gray-900">
                  Topics <span className="text-red-500">*</span>
                </h3>
              </div>

              <p className="text-xs text-gray-500 mb-4 font-medium">
                {formData.topic_ids.length} of {topics.length} selected
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
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.topic_ids.includes(topic.id)}
                        onChange={() => toggleTopic(topic.id)}
                        className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900/10 cursor-pointer transition-all"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {topic.name}
                      </span>
                    </label>
                  ))
                )}
              </div>

              {/* Selected Topics */}
              {formData.topic_ids.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-3">
                    Selected Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topics
                      .filter((t) => formData.topic_ids.includes(t.id))
                      .map((topic) => (
                        <span
                          key={topic.id}
                          className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border border-gray-200"
                        >
                          {topic.name}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-8 py-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 text-sm font-medium border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all"
        >
          {mode === "create" ? "Create Article" : "Update Article"}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;

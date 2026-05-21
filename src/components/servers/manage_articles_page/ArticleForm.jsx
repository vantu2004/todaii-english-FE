import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchTopicsNoPaged } from "@/api/servers/topicApi";
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white px-8 py-4 border-b border-gray-100">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {mode === "create" ? "Add New Article" : "Update Article"}
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            {mode === "create"
              ? "Fill in the details to create a new article entry"
              : "Modify article details and update content information"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
            {mode === "create" ? "New" : "Updating"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT FORM AREA */}
          <div className="lg:col-span-2 space-y-6">
            {/* TITLE */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                required
                onChange={handleChange}
                placeholder="Enter article title"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
              />
            </motion.div>

            {/* SOURCE */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="source_name"
                  value={formData.source_name}
                  required
                  onChange={handleChange}
                  placeholder="Enter source name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source ID
                </label>
                <input
                  type="text"
                  name="source_id"
                  value={formData.source_id}
                  onChange={handleChange}
                  placeholder="Enter source ID"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                />
              </div>
            </motion.div>

            {/* SOURCE URL */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="source_url"
                value={formData.source_url}
                required
                onChange={handleChange}
                placeholder="https://example.com/article"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
              />
            </motion.div>

            {/* AUTHOR */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                required
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
              />
            </motion.div>

            {/* IMAGE URL */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
              />

              {formData.image_url && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg overflow-hidden border border-gray-200 bg-white p-2"
                >
                  <img
                    src={formData.image_url}
                    alt="Image Preview"
                    className="w-full h-auto object-cover rounded"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* DESCRIPTION */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                rows={5}
                required
                onChange={handleChange}
                placeholder="Enter description..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all resize-none"
              />
            </motion.div>

            {/* META: PUBLISHED AT & CEFR */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Published At <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="published_at"
                  value={formData.published_at}
                  required
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEFR Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="cefr_level"
                  value={formData.cefr_level}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                >
                  {CEFR_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: TOPICS */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
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
                    <motion.label
                      key={topic.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.topic_ids.includes(topic.id)}
                        onChange={() => toggleTopic(topic.id)}
                        className="w-5 h-5 rounded border-gray-300 cursor-pointer appearance-none bg-white border transition-all"
                        style={{
                          backgroundImage: formData.topic_ids.includes(topic.id)
                            ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.207 5.207L6.5 11.914 2.793 8.207'/%3E%3C/svg%3E")`
                            : "none",
                          backgroundColor: formData.topic_ids.includes(topic.id)
                            ? "#111827"
                            : "white",
                          borderColor: formData.topic_ids.includes(topic.id)
                            ? "#111827"
                            : "#d1d5db",
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700">
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
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-700 mb-3">
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
                          className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md border border-gray-200"
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
      <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-8 py-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {mode === "create" ? "Create Article" : "Update Article"}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;

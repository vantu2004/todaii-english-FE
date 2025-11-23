import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchTopicsNoPaged } from "../../../api/servers/topicApi";
import { logError } from "../../../utils/LogError";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const VideoForm = ({ mode = "create", initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    author_name: initialData.author_name || "",
    provider_name: initialData.provider_name || "",
    provider_url: initialData.provider_url || "",
    thumbnail_url: initialData.thumbnail_url || "",
    embed_html: initialData.embed_html || "",
    video_url: initialData.video_url || "",
    cefr_level: initialData.cefr_level || "A1",
    topic_ids:
      initialData.topic_ids || initialData.topics?.map((t) => t.id) || [],
  });

  const [topics, setTopics] = useState([]);

  useEffect(() => {
    setFormData({
      title: initialData.title || "",
      author_name: initialData.author_name || "",
      provider_name: initialData.provider_name || "",
      provider_url: initialData.provider_url || "",
      thumbnail_url: initialData.thumbnail_url || "",
      embed_html: initialData.embed_html || "",
      video_url: initialData.video_url || "",
      cefr_level: initialData.cefr_level || "A1",
      topic_ids:
        initialData.topic_ids || initialData.topics?.map((t) => t.id) || [],
    });
  }, [initialData]);

  const handleFetchTopics = async () => {
    try {
      const data = await fetchTopicsNoPaged("VIDEO");
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
    const payload = { ...initialData, ...formData };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-slate-50"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-b-lg px-8 py-3 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {mode === "create" ? "Add New Video" : "Update Video"}
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            {mode === "create"
              ? "Fill in the details to create a new video entry"
              : "Modify video details and update content information"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* optional icon or status badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                required
                onChange={handleChange}
                placeholder="Enter video title"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </motion.div>

            {/* AUTHOR */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </motion.div>

            {/* PROVIDER */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Provider Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="provider_name"
                  value={formData.provider_name}
                  onChange={handleChange}
                  placeholder="e.g., YouTube, Vimeo"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Provider URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="provider_url"
                  value={formData.provider_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </motion.div>

            {/* VIDEO URL */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Video URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="video_url"
                value={formData.video_url}
                required
                onChange={handleChange}
                placeholder="https://example.com/video"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </motion.div>

            {/* EMBED HTML */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Embed HTML <span className="text-red-500">*</span>
              </label>
              <textarea
                name="embed_html"
                value={formData.embed_html}
                rows={4}
                onChange={handleChange}
                placeholder="Paste embed code here..."
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </motion.div>

            {/* THUMBNAIL */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Thumbnail URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleChange}
                placeholder="https://example.com/thumbnail.jpg"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />

              {formData.thumbnail_url && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg overflow-hidden border border-slate-200 shadow-md bg-white p-2"
                >
                  <img
                    src={formData.thumbnail_url}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover rounded"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* CEFR */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                CEFR Level <span className="text-red-500">*</span>
              </label>
              <select
                name="cefr_level"
                value={formData.cefr_level}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {CEFR_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          {/* RIGHT: TOPICS */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white border border-slate-200 rounded-xl p-6 sticky top-8 shadow-md"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
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
                            ? "#2563eb"
                            : "white",
                          borderColor: formData.topic_ids.includes(topic.id)
                            ? "#2563eb"
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
                          className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full border border-blue-200"
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
          className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:shadow-lg hover:scale-105 transition-all active:scale-95 shadow-md"
        >
          {mode === "create" ? "Create Video" : "Update Video"}
        </button>
      </div>
    </form>
  );
};

export default VideoForm;

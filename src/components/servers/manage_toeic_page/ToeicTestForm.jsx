import { useState, useEffect } from "react";
import { fetchToeicCollections } from "@/api/servers/toeicCollectionApi";
import {
  uploadToeicTestFile,
  deleteToeicTestFile,
} from "@/api/servers/toeicTestApi";
import { toast } from "react-hot-toast";
import {
  FileText,
  Type,
  Clock,
  Image as ImageIcon,
  FileAudio,
  LayoutList,
  Layers,
  ToggleLeft,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ToeicTestForm = ({ mode, initialData = null, onSubmit }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    test_type: "TOEIC_LR",
    duration: 120,
    audio_url: "",
    image_url: "",
    description: "",
    status: "DRAFT",
    collection_id: "",
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [isDeletingAudio, setIsDeletingAudio] = useState(false);

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchToeicCollections(1, 1000)
      .then((data) => {
        setCollections(data.content || []);
      })
      .catch((err) =>
        console.error("Error fetching collections for dropdown", err),
      );
  }, []);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || "",
        test_type: initialData.test_type || initialData.testType || "TOEIC_LR",
        duration: initialData.duration || 120,
        audio_url:
          initialData.audio_request?.uploaded_audio ||
          initialData.audio_request?.audio_url ||
          initialData.audio_url ||
          initialData.audioUrl ||
          "",
        image_url:
          initialData.image_request?.uploaded_image ||
          initialData.image_request?.image_url ||
          initialData.image_url ||
          initialData.imageUrl ||
          initialData.thumbnail ||
          "",
        description: initialData.description || "",
        status: initialData.status || "DRAFT",
        collection_id:
          initialData.collection?.id || initialData.collection_id || "",
      });
    }
  }, [initialData]);

  const handleUploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const testId = initialData?.id || 0;

    if (type === "image") setIsUploadingImage(true);
    else setIsUploadingAudio(true);

    try {
      const url = await uploadToeicTestFile(testId, file);
      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "image_url" : "audio_url"]: url,
      }));
      toast.success(
        `${type === "image" ? "Image" : "Audio"} uploaded successfully!`,
      );
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      if (type === "image") setIsUploadingImage(false);
      else setIsUploadingAudio(false);
      e.target.value = null;
    }
  };

  const handleDeleteFile = async (type) => {
    const url = type === "image" ? formData.image_url : formData.audio_url;
    if (!url) return;

    if (type === "image") setIsDeletingImage(true);
    else setIsDeletingAudio(true);

    try {
      if (url.includes("cloudinary")) {
        await deleteToeicTestFile(url);
      }
      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "image_url" : "audio_url"]: "",
      }));
      toast.success(`${type === "image" ? "Image" : "Audio"} removed!`);
    } catch (err) {
      toast.error(`Failed to delete ${type}`);
    } finally {
      if (type === "image") setIsDeletingImage(false);
      else setIsDeletingAudio(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      title: formData.title,
      test_type: formData.test_type,
      duration: formData.duration,
      description: formData.description,
      status: formData.status,
      collection_id: formData.collection_id
        ? Number(formData.collection_id)
        : null,
      image_request: {
        uploaded_image: formData.image_url?.includes("cloudinary")
          ? formData.image_url
          : "",
        image_url: !formData.image_url?.includes("cloudinary")
          ? formData.image_url
          : "",
      },
      audio_request: {
        uploaded_audio: formData.audio_url?.includes("cloudinary")
          ? formData.audio_url
          : "",
        audio_url: !formData.audio_url?.includes("cloudinary")
          ? formData.audio_url
          : "",
      },
    };
    onSubmit(submitData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 h-full overflow-y-auto p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-sm">
          <FileText className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {mode === "create" ? "Create TOEIC Test" : "Update TOEIC Test"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill in the details below to{" "}
            {mode === "create" ? "create a new" : "update the"} test
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-750 rounded-2xl p-6 border border-blue-100 dark:border-gray-700 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                <Type size={16} className="text-blue-600 dark:text-blue-400" />
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., ETS 2024 Test 1"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                <LayoutList
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
                Test Type
              </label>
              <select
                name="test_type"
                value={formData.test_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm"
              >
                <option value="TOEIC_LR">TOEIC LR</option>
                <option value="TOEIC_SW">TOEIC SW</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                Duration (mins)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                <Layers
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
                Collection
              </label>
              <select
                name="collection_id"
                value={formData.collection_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm"
              >
                <option value="">-- Select a Collection --</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                <ToggleLeft
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  <ImageIcon
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  Image URL
                </label>
                <div className="flex gap-2 items-center">
                  <label
                    className={`cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors ${isUploadingImage ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    {isUploadingImage ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadFile(e, "image")}
                    />
                  </label>
                  {formData.image_url?.includes("cloudinary") && (
                    <button
                      type="button"
                      onClick={() => handleDeleteFile("image")}
                      disabled={isDeletingImage}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors"
                    >
                      {isDeletingImage ? "Removing..." : "Remove Uploaded"}
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm mb-3"
                disabled={formData.image_url?.includes("cloudinary")}
              />
              {formData.image_url && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 rounded-lg overflow-hidden border border-slate-200 shadow-md bg-white p-2 flex flex-wrap gap-4"
                >
                  <div className="flex-1 min-w-[200px]">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                      Image Preview
                    </span>
                    <img
                      src={formData.image_url}
                      alt="Image preview"
                      className="w-full h-auto object-cover rounded max-h-48"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  <FileAudio
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  Audio URL
                </label>
                <div className="flex gap-2 items-center">
                  <label
                    className={`cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors ${isUploadingAudio ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    {isUploadingAudio ? "Uploading..." : "Upload Audio"}
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => handleUploadFile(e, "audio")}
                    />
                  </label>
                  {formData.audio_url?.includes("cloudinary") && (
                    <button
                      type="button"
                      onClick={() => handleDeleteFile("audio")}
                      disabled={isDeletingAudio}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors"
                    >
                      {isDeletingAudio ? "Removing..." : "Remove Uploaded"}
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                name="audio_url"
                value={formData.audio_url}
                onChange={handleChange}
                placeholder="https://example.com/audio.mp3"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm mb-3"
                disabled={formData.audio_url?.includes("cloudinary")}
              />
              {formData.audio_url && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 rounded-lg overflow-hidden border border-slate-200 shadow-md bg-white p-4 flex flex-col gap-4"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                      Audio Preview
                    </span>
                    <audio controls className="w-full" src={formData.audio_url}>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                <FileText
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe this test..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate("/server/toeic-test")}
            className="px-6 py-2.5 flex items-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Save size={18} />
            {mode === "create" ? "Create Test" : "Update Test"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ToeicTestForm;

import { Image as ImageIcon, FileAudio } from "lucide-react";
import { motion } from "framer-motion";

const TestMediaUploads = ({
  formData,
  handleChange,
  handleUploadFile,
  handleDeleteFile,
  isUploadingImage,
  isUploadingAudio,
  isDeletingImage,
  isDeletingAudio,
}) => {
  return (
    <>
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            <ImageIcon size={16} className="text-blue-600 dark:text-blue-400" />
            Image URL
          </label>
          <div className="flex gap-2 items-center">
            <label
              className={`cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors ${
                isUploadingImage ? "opacity-50 pointer-events-none" : ""
              }`}
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
            <FileAudio size={16} className="text-blue-600 dark:text-blue-400" />
            Audio URL
          </label>
          <div className="flex gap-2 items-center">
            <label
              className={`cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors ${
                isUploadingAudio ? "opacity-50 pointer-events-none" : ""
              }`}
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
    </>
  );
};

export default TestMediaUploads;

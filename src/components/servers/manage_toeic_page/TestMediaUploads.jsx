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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image URL
          </label>
          <div className="flex gap-2 items-center">
            {!formData.image_url?.includes("cloudinary") ? (
              <label
                className={`cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors ${isUploadingImage ? "opacity-50 pointer-events-none" : ""
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
            ) : (
              <button
                type="button"
                onClick={() => handleDeleteFile("image")}
                disabled={isDeletingImage}
                className="px-3 py-1.5 bg-white text-red-600 rounded-lg text-xs font-medium border border-gray-200 hover:bg-red-50 transition-colors"
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
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 dark:bg-gray-700 dark:text-white outline-none transition-all mb-3"
          disabled={formData.image_url?.includes("cloudinary")}
        />
        {formData.image_url && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-3 flex flex-wrap gap-4"
          >
            <div className="flex-1 min-w-[200px]">
              <span className="text-xs font-medium text-gray-500 block mb-2">
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Audio URL
          </label>
          <div className="flex gap-2 items-center">
            {!formData.audio_url?.includes("cloudinary") ? (
              <label
                className={`cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors ${isUploadingAudio ? "opacity-50 pointer-events-none" : ""
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
            ) : (
              <button
                type="button"
                onClick={() => handleDeleteFile("audio")}
                disabled={isDeletingAudio}
                className="px-3 py-1.5 bg-white text-red-600 rounded-lg text-xs font-medium border border-gray-200 hover:bg-red-50 transition-colors"
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
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 dark:bg-gray-700 dark:text-white outline-none transition-all mb-3"
          disabled={formData.audio_url?.includes("cloudinary")}
        />
        {formData.audio_url && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-4 flex flex-col gap-4"
          >
            <div>
              <span className="text-xs font-medium text-gray-500 block mb-2">
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

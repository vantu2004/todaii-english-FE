import { useState, useEffect } from "react";
import Modal from "@/components/servers/Modal";
import { Save, X, Image as ImageIcon, FileAudio, FileText } from "lucide-react";
import { uploadToeicTestFile, deleteToeicTestFile } from "@/api/servers/toeicTestApi";
import { createPassage, updatePassage } from "@/api/servers/toeicPassageApi";
import { logError } from "@/utils/LogError";
import toast from "react-hot-toast";

const ToeicPassageFormModal = ({ isOpen, onClose, initialData, partNumber, testId, onSuccess }) => {
  const isUpdate = !!initialData;

  const [formData, setFormData] = useState({
    passageText: "",
    passageTrans: "",
    imageUrl: "",
    audioUrl: "",
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [isDeletingAudio, setIsDeletingAudio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        passageText: initialData.passageText || initialData.passage_text || "",
        passageTrans: initialData.passageTrans || initialData.passage_trans || "",
        imageUrl: initialData.imageUrl || initialData.image_url || initialData.image_request?.uploaded_image || initialData.image_request?.image_url || "",
        audioUrl: initialData.audioUrl || initialData.audio_url || initialData.audio_request?.uploaded_audio || initialData.audio_request?.audio_url || "",
      });
    } else {
      setFormData({
        passageText: "",
        passageTrans: "",
        imageUrl: "",
        audioUrl: "",
      });
    }
  }, [initialData]);

  const handleUploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "image") setIsUploadingImage(true);
    else setIsUploadingAudio(true);

    try {
      const url = await uploadToeicTestFile(testId, file);
      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "imageUrl" : "audioUrl"]: url,
      }));
      toast.success(`${type === "image" ? "Image" : "Audio"} uploaded successfully!`);
    } catch (err) {
      logError(err);
      toast.error(`Failed to upload ${type}`);
    } finally {
      if (type === "image") setIsUploadingImage(false);
      else setIsUploadingAudio(false);
      e.target.value = null;
    }
  };

  const handleDeleteFile = async (type) => {
    const url = type === "image" ? formData.imageUrl : formData.audioUrl;
    if (!url) return;

    if (type === "image") setIsDeletingImage(true);
    else setIsDeletingAudio(true);

    try {
      if (url.includes("cloudinary")) {
        await deleteToeicTestFile(url);
      }
      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "imageUrl" : "audioUrl"]: "",
      }));
      toast.success(`${type === "image" ? "Image" : "Audio"} removed!`);
    } catch (err) {
      logError(err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      passageText: formData.passageText,
      passageTrans: formData.passageTrans,
      imageRequest: {
        uploaded_image: formData.imageUrl?.includes("cloudinary") ? formData.imageUrl : "",
        image_url: !formData.imageUrl?.includes("cloudinary") ? formData.imageUrl : "",
      },
      audioRequest: {
        uploaded_audio: formData.audioUrl?.includes("cloudinary") ? formData.audioUrl : "",
        audio_url: !formData.audioUrl?.includes("cloudinary") ? formData.audioUrl : "",
      },
    };

    try {
      if (isUpdate) {
        await updatePassage(initialData.id, payload);
        toast.success("Passage updated successfully");
      } else {
        await createPassage(testId, partNumber, payload);
        toast.success("Passage created successfully");
      }
      onSuccess();
    } catch (err) {
      logError(err);
      toast.error(err.response?.data?.message || "Failed to save passage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? "Update Passage" : "Create Passage"}
      width="sm:max-w-4xl"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {isSubmitting ? "Saving..." : "Save Passage"}
          </button>
        </div>
      }
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FileText size={16} className="text-blue-600" />
              Passage Text <span className="text-red-500">*</span>
            </label>
            <textarea
              name="passageText"
              value={formData.passageText}
              onChange={handleChange}
              rows={6}
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FileText size={16} className="text-green-600" />
              Passage Translation <span className="text-red-500">*</span>
            </label>
            <textarea
              name="passageTrans"
              value={formData.passageTrans}
              onChange={handleChange}
              rows={6}
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <ImageIcon size={16} className="text-blue-600" />
                Image URL
              </label>
              <div className="flex gap-2 items-center">
                <label className={`cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                  {isUploadingImage ? "Uploading..." : "Upload Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadFile(e, 'image')} />
                </label>
                {formData.imageUrl?.includes('cloudinary') && (
                  <button type="button" onClick={() => handleDeleteFile('image')} disabled={isDeletingImage} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors">
                    {isDeletingImage ? "Removing..." : "Remove Uploaded"}
                  </button>
                )}
              </div>
            </div>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none mb-3"
              disabled={formData.imageUrl?.includes('cloudinary')}
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-auto object-cover rounded max-h-48 border border-gray-200"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FileAudio size={16} className="text-blue-600" />
                Audio URL {(partNumber === 3 || partNumber === 4) && <span className="text-red-500">*</span>}
              </label>
              <div className="flex gap-2 items-center">
                <label className={`cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors ${isUploadingAudio ? 'opacity-50 pointer-events-none' : ''}`}>
                  {isUploadingAudio ? "Uploading..." : "Upload Audio"}
                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleUploadFile(e, 'audio')} />
                </label>
                {formData.audioUrl?.includes('cloudinary') && (
                  <button type="button" onClick={() => handleDeleteFile('audio')} disabled={isDeletingAudio} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors">
                    {isDeletingAudio ? "Removing..." : "Remove Uploaded"}
                  </button>
                )}
              </div>
            </div>
            <input
              type="text"
              name="audioUrl"
              value={formData.audioUrl}
              onChange={handleChange}
              placeholder="https://example.com/audio.mp3"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none mb-3"
              disabled={formData.audioUrl?.includes('cloudinary')}
              required={partNumber === 3 || partNumber === 4}
            />
            {formData.audioUrl && (
              <audio controls className="w-full" src={formData.audioUrl}>
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ToeicPassageFormModal;

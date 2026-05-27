import { useState, useEffect, useRef } from "react";
import { fetchToeicCollections } from "@/api/servers/toeicCollectionApi";
import {
  uploadToeicTestFile,
  deleteToeicTestFile,
  updateToeicTest,
} from "@/api/servers/toeicTestApi";
import { toast } from "react-hot-toast";
import { FileText, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TestBasicDetails from "./TestBasicDetails";
import TestMediaUploads from "./TestMediaUploads";
import TestDescription from "./TestDescription";

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

  const isSavedRef = useRef(false);
  const uploadedUrlsRef = useRef({ image: "", audio: "" });
  const initialUrlsRef = useRef({ image: "", audio: "" });

  useEffect(() => {
    return () => {
      if (!isSavedRef.current) {
        const { image, audio } = uploadedUrlsRef.current;
        if (image && image.includes("cloudinary")) {
          deleteToeicTestFile(image).catch((err) => console.error("Error cleaning up image:", err));
        }
        if (audio && audio.includes("cloudinary")) {
          deleteToeicTestFile(audio).catch((err) => console.error("Error cleaning up audio:", err));
        }
      }
    };
  }, []);

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
      const img = initialData.image_request?.uploaded_image ||
        initialData.image_request?.image_url ||
        initialData.image_url ||
        initialData.imageUrl ||
        initialData.thumbnail ||
        "";
      const aud = initialData.audio_request?.uploaded_audio ||
        initialData.audio_request?.audio_url ||
        initialData.audio_url ||
        initialData.audioUrl ||
        "";
      initialUrlsRef.current = { image: img, audio: aud };
      setFormData({
        title: initialData.title || "",
        test_type: initialData.test_type || initialData.testType || "TOEIC_LR",
        duration: initialData.duration || 120,
        audio_url: aud,
        image_url: img,
        description: initialData.description || "",
        status: initialData.status || "DRAFT",
        collection_id:
          initialData.collection?.id || initialData.collection_id || "",
      });
    } else {
      initialUrlsRef.current = { image: "", audio: "" };
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
      uploadedUrlsRef.current[type] = url;
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
      // Only delete from Cloudinary immediately if it was newly uploaded in this session
      if (url === uploadedUrlsRef.current[type]) {
        if (url.includes("cloudinary")) {
          await deleteToeicTestFile(url);
        }
        uploadedUrlsRef.current[type] = "";
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

  const handleSubmit = async (e) => {
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
    try {
      await onSubmit(submitData);
      isSavedRef.current = true;
      const { image: initialImage, audio: initialAudio } = initialUrlsRef.current;
      if (initialImage && initialImage !== formData.image_url && initialImage.includes("cloudinary")) {
        deleteToeicTestFile(initialImage).catch((err) => console.error("Error deleting old image:", err));
      }
      if (initialAudio && initialAudio !== formData.audio_url && initialAudio.includes("cloudinary")) {
        deleteToeicTestFile(initialAudio).catch((err) => console.error("Error deleting old audio:", err));
      }
    } catch (err) {
      console.error("Failed to save test", err);
    }
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
            <TestBasicDetails
              formData={formData}
              handleChange={handleChange}
              collections={collections}
            />

            <TestMediaUploads
              formData={formData}
              handleChange={handleChange}
              handleUploadFile={handleUploadFile}
              handleDeleteFile={handleDeleteFile}
              isUploadingImage={isUploadingImage}
              isUploadingAudio={isUploadingAudio}
              isDeletingImage={isDeletingImage}
              isDeletingAudio={isDeletingAudio}
            />

            <TestDescription formData={formData} handleChange={handleChange} />
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

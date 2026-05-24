import { useState, useEffect } from "react";
import { fetchToeicCollections } from "@/api/servers/toeicCollectionApi";
import {
  uploadToeicTestFile,
  deleteToeicTestFile,
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
      <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {mode === "create" ? "Create TOEIC Test" : "Update TOEIC Test"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 space-y-6">
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

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={() => navigate("/server/toeic-test")}
            className="px-5 py-2.5 flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 flex items-center gap-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
          >
            {mode === "create" ? "Create Test" : "Update Test"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ToeicTestForm;

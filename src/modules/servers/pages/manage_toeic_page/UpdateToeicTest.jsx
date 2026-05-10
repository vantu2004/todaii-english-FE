import toast from "react-hot-toast";
import { getToeicTestById, updateToeicTest } from "../../../../api/servers/toeicTestApi";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logError } from "../../../../utils/LogError";
import ToeicTestForm from "../../../../components/servers/manage_toeic_page/ToeicTestForm";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";

const UpdateToeicTest = () => {
  const { setHeader } = useHeaderContext();
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setHeader({
      title: "Manage TOEIC Tests",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage TOEIC Tests", to: "/server/toeic-test" },
        { label: "Update Test" },
      ],
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getToeicTestById(id);
        setTest(data);
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpdateTest = async (formData) => {
    try {
      await updateToeicTest(id, formData);
      toast.success("Test updated successfully!");
      navigate("/server/toeic-test");
    } catch (error) {
      logError(error);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  if (!test) {
    return (
      <div className="p-8 text-red-500">
        Cannot load test. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <ToeicTestForm
          mode="update"
          initialData={test}
          onSubmit={handleUpdateTest}
        />
      </motion.div>
    </div>
  );
};

export default UpdateToeicTest;

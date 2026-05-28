import { createToeicTest } from "@/api/servers/toeicTestApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { logError } from "@/utils/LogError";
import ToeicTestForm from "@/components/servers/manage_toeic_page/ToeicTestForm";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";
import toast from "react-hot-toast";

const CreateToeicTest = () => {
  const { setHeader } = useHeaderContext();
  const navigate = useNavigate();

  const handleCreateTest = async (data) => {
    try {
      await createToeicTest(data);
      toast.success("Test created successfully");
      navigate("/server/toeic-test");
    } catch (error) {
      logError(error);
      throw error;
    }
  };

  useEffect(() => {
    setHeader({
      title: "Manage TOEIC Tests",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage TOEIC Tests", to: "/server/toeic-test" },
        { label: "Create Test" },
      ],
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-200 rounded-lg"
      >
        <ToeicTestForm
          mode="create"
          initialData={{}}
          onSubmit={handleCreateTest}
        />
      </motion.div>
    </div>
  );
};

export default CreateToeicTest;

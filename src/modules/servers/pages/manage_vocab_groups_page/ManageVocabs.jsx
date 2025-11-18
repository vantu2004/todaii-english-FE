import { useEffect } from "react";
import ToolBar from "../../../../components/servers/ToolBar";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const ManageVocabs = () => {
  const { id } = useParams();

  useEffect(() => {}, []);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-none">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Manage Vocabularies
          </h2>

          <ToolBar updateQuery={null} setIsModalOpen={null} />

          <h4 className="mt-6 mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            Vocab Groups Table
          </h4>
        </div>

        {/* Table wrapper */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
        ></motion.div>
      </div>
    </>
  );
};

export default ManageVocabs;

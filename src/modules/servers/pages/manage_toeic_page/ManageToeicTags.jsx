import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ToolBar from "../../../../components/servers/ToolBar";
import {
  fetchAllToeicTags,
  createToeicTag,
  updateToeicTag,
} from "../../../../api/servers/toeicTagApi";
import { motion } from "framer-motion";
import { logError } from "../../../../utils/LogError";
import ToeicTagsTable from "../../../../components/servers/manage_toeic_page/ToeicTagsTable";
import ToeicTagFormModal from "../../../../components/servers/manage_toeic_page/ToeicTagFormModal";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";

const ManageToeicTags = () => {
  const { setHeader } = useHeaderContext();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  // For tags without pagination, we can still use query for search/filter locally
  const [query, setQuery] = useState({
    keyword: "",
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tag Name" },
    { key: "alias", label: "Alias" },
    { key: "actions", label: "Actions" },
  ];

  const reloadTags = async () => {
    try {
      setLoading(true);
      const data = await fetchAllToeicTags();
      setTags(data || []);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHeader({
      title: "Manage TOEIC Tags",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage TOEIC Tags" },
      ],
    });
    reloadTags();
  }, []);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleOpenModal = (tag = null) => {
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  const handleSubmit = async (name) => {
    try {
      if (editingTag) {
        await updateToeicTag(editingTag.id, name);
        toast.success("Tag updated successfully");
      } else {
        await createToeicTag(name);
        toast.success("Tag created successfully");
      }
      await reloadTags();
      handleCloseModal();
    } catch (error) {
      logError(error);
    }
  };

  const filteredTags = tags.filter(t => t.name.toLowerCase().includes(query.keyword.toLowerCase()));

  return (
    <>
      <div className="flex flex-col h-full">
        <ToolBar
          updateQuery={updateQuery}
          setIsModalOpen={() => handleOpenModal()}
        />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
        >
          <ToeicTagsTable
            columns={columns}
            tags={filteredTags}
            reloadTags={reloadTags}
            onEdit={handleOpenModal}
          />
        </motion.div>
      </div>

      {isModalOpen && (
        <ToeicTagFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={editingTag}
        />
      )}
    </>
  );
};

export default ManageToeicTags;

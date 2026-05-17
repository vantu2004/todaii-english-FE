import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ToolBar from "@/components/servers/ToolBar";
import {
  fetchAllToeicTags,
  createToeicTag,
  updateToeicTag,
} from "@/api/servers/toeicTagApi";
import { motion } from "framer-motion";
import { logError } from "@/utils/LogError";
import ToeicTagsTable from "@/components/servers/manage_toeic_page/ToeicTagsTable";
import ToeicTagFormModal from "@/components/servers/manage_toeic_page/ToeicTagFormModal";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";

const ManageToeicTags = () => {
  const { setHeader } = useHeaderContext();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  // For tags without pagination, we can still use query for search/filter locally
  const [query, setQuery] = useState({
    keyword: "",
    sortBy: "id",
    direction: "desc",
  });

  const columns = [
    { key: "id", label: "ID", sortField: "id" },
    { key: "name", label: "Tag Name", sortField: "name" },
    { key: "alias", label: "Alias", sortField: "alias" },
    { key: "part_number", label: "Part Number", sortField: "part_number" },
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  const handleSubmit = async (name) => {
    try {
      await createToeicTag(name);
      toast.success("Tag created successfully");
      await reloadTags();
      handleCloseModal();
    } catch (error) {
      logError(error);
    }
  };

  const handleSaveEdit = async (id, newName, newPartNumber) => {
    try {
      await updateToeicTag(id, newName, newPartNumber);
      toast.success("Tag updated successfully");
      await reloadTags();
    } catch (error) {
      logError(error);
    }
  };

  let filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(query.keyword.toLowerCase()),
  );

  if (query.sortBy) {
    filteredTags.sort((a, b) => {
      let valA = a[query.sortBy];
      let valB = b[query.sortBy];

      if (valA === null || valA === undefined) valA = "";
      if (valB === null || valB === undefined) valB = "";

      if (valA < valB) return query.direction === "asc" ? -1 : 1;
      if (valA > valB) return query.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

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
            query={query}
            updateQuery={updateQuery}
            onSaveEdit={handleSaveEdit}
          />
        </motion.div>
      </div>

      {isModalOpen && (
        <ToeicTagFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default ManageToeicTags;

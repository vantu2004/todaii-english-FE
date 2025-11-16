import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ToolBar from "../../../components/servers/ToolBar";
import Pagination from "../../../components/servers/Pagination";
import {
  fetchVocabGroups,
  createVocabGroup,
} from "../../../api/servers/vocabGroupApi";
import { motion } from "framer-motion";
import { logError } from "../../../utils/LogError";
import VocabGroupsTable from "../../../components/servers/manage_vocab_groups_page/VocabGroupsTable";
import VocabGroupFormModal from "../../../components/servers/manage_vocab_groups_page/VocabGroupFormModal";

const ManageVocabGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Query chung
  const [query, setQuery] = useState({
    page: 1,
    size: 10,
    sortBy: "id",
    direction: "desc",
    keyword: "",
  });

  // Pagination metadata
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const columns = [
    { key: "id", label: "ID", sortField: "id" },
    { key: "name", label: "Group Name", sortField: "name" },
    { key: "alias", label: "Alias", sortField: "alias" },
    { key: "updatedAt", label: "Updated At", sortField: "updatedAt" },
    { key: "enable", label: "Enable", sortField: "enabled" },
    { key: "actions", label: "Actions" },
  ];

  // Fetch API
  const reloadGroups = async () => {
    try {
      setLoading(true);

      const data = await fetchVocabGroups(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setGroups(data.content || []);

      setPagination({
        totalElements: data.total_elements,
        totalPages: data.total_pages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadGroups();
  }, [query]);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleConfirmCreate = async (data) => {
    try {
      await createVocabGroup(data);
      await reloadGroups();

      setIsCreateModalOpen(false);
      toast.success("Vocab group created successfully");
    } catch (error) {
      logError(error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-none">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Manage Vocabulary Groups
          </h2>

          <ToolBar
            updateQuery={updateQuery}
            setIsModalOpen={setIsCreateModalOpen}
          />

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
        >
          <VocabGroupsTable
            columns={columns}
            groups={groups}
            reloadGroups={reloadGroups}
            query={query}
            updateQuery={updateQuery}
          />
        </motion.div>

        {/* Pagination */}
        <div className="flex-none mt-4">
          <Pagination
            query={query}
            updateQuery={updateQuery}
            pagination={pagination}
          />
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <VocabGroupFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleConfirmCreate}
        />
      )}
    </>
  );
};

export default ManageVocabGroups;

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ToolBar from "../../../../components/servers/ToolBar";
import Pagination from "../../../../components/servers/Pagination";
import {
  fetchToeicTests,
  createToeicTest,
  updateToeicTest,
} from "../../../../api/servers/toeicTestApi";
import { motion } from "framer-motion";
import { logError } from "../../../../utils/LogError";
import ToeicTestsTable from "../../../../components/servers/manage_toeic_page/ToeicTestsTable";
import ToeicTestFormModal from "../../../../components/servers/manage_toeic_page/ToeicTestFormModal";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";

const ManageToeicTests = () => {
  const { setHeader } = useHeaderContext();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  const [query, setQuery] = useState({
    page: 1,
    size: 10,
    sortBy: "id",
    direction: "desc",
    keyword: "",
  });

  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const columns = [
    { key: "id", label: "ID", sortField: "id" },
    { key: "title", label: "Title", sortField: "title" },
    { key: "type", label: "Type", sortField: "testType" },
    { key: "duration", label: "Duration" },
    { key: "collection", label: "Collection" },
    { key: "status", label: "Status", sortField: "status" },
    { key: "updated_at", label: "Updated At", sortField: "updatedAt" },
    { key: "actions", label: "Actions" },
  ];

  const reloadTests = async () => {
    try {
      setLoading(true);
      const data = await fetchToeicTests(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setTests(data.content || []);
      setPagination({
        totalElements: data.totalElements || data.total_elements,
        totalPages: data.totalPages || data.total_pages,
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
    setHeader({
      title: "Manage TOEIC Tests",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage TOEIC Tests" },
      ],
    });
  }, []);

  useEffect(() => {
    reloadTests();
  }, [query]);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleOpenModal = (test = null) => {
    setEditingTest(test);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTest(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingTest) {
        await updateToeicTest(editingTest.id, data);
        toast.success("Test updated successfully");
      } else {
        await createToeicTest(data);
        toast.success("Test created successfully");
      }
      await reloadTests();
      handleCloseModal();
    } catch (error) {
      logError(error);
    }
  };

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
          <ToeicTestsTable
            columns={columns}
            tests={tests}
            reloadTests={reloadTests}
            query={query}
            updateQuery={updateQuery}
            onEdit={handleOpenModal}
          />
        </motion.div>

        <div className="flex-none mt-4">
          <Pagination
            query={query}
            updateQuery={updateQuery}
            pagination={pagination}
          />
        </div>
      </div>

      {isModalOpen && (
        <ToeicTestFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={editingTest}
        />
      )}
    </>
  );
};

export default ManageToeicTests;

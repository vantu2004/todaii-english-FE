import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ToolBar from "@/components/servers/ToolBar";
import Pagination from "@/components/servers/Pagination";
import { fetchTestsByCollectionId } from "@/api/servers/toeicTestApi";
import { motion } from "framer-motion";
import { logError } from "@/utils/LogError";
import ToeicTestsTable from "@/components/servers/manage_toeic_page/ToeicTestsTable";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";
import { useNavigate, useParams } from "react-router-dom";

const TestsInToeicCollection = () => {
  const { setHeader } = useHeaderContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { key: "duration", label: "Duration", sortField: "duration" },
    { key: "audio", label: "Audio" },
    { key: "collection", label: "Collection", sortField: "collection" },
    { key: "status", label: "Status", sortField: "status" },
    { key: "updated_at", label: "Updated At", sortField: "updatedAt" },
    { key: "content", label: "Content" },
    { key: "actions", label: "Actions" },
  ];

  const reloadTests = async () => {
    try {
      setLoading(true);
      const data = await fetchTestsByCollectionId(
        id,
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword,
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
      title: "Tests in Collection",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage TOEIC Collections", to: "/server/toeic-collection" },
        { label: "Tests in Collection" },
      ],
    });
  }, []);

  useEffect(() => {
    reloadTests();
  }, [query]);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleOpenCreate = () => {
    navigate("/server/toeic-test/create");
  };

  const handleOpenUpdate = (test) => {
    navigate(`/server/toeic-test/${test.id}/update`);
  };

  const handleOpenContent = (test) => {
    navigate(`/server/toeic-test/${test.id}/content`);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <ToolBar updateQuery={updateQuery} setIsModalOpen={handleOpenCreate} />

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
            onEdit={handleOpenUpdate}
            onManageContent={handleOpenContent}
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
    </>
  );
};

export default TestsInToeicCollection;

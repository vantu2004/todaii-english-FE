import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ToolBar from "../../../components/servers/ToolBar";
import Pagination from "../../../components/servers/Pagination";
import { fetchTopics, createTopic } from "../../../api/servers/topicApi";
import TopicsTable from "../../../components/servers/manage_topics_page/TopicsTable";
import TopicFormModal from "../../../components/servers/manage_topics_page/TopicFormModal";

const ManageTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State chung cho phân trang, sort, search
  const [query, setQuery] = useState({
    page: 1,
    size: 10,
    sortBy: "id",
    direction: "desc",
    keyword: "",
  });

  // State metadata từ API
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const columns = [
    { key: "id", label: "ID", sortField: "id" },
    { key: "name", label: "Topic Name", sortField: "name" },
    { key: "alias", label: "Alias", sortField: "alias" },
    { key: "topicType", label: "Type", sortField: "topicType" },
    { key: "updatedAt", label: "Updated At", sortField: "updatedAt" },
    { key: "enable", label: "Enable", sortField: "enabled" },
    { key: "actions", label: "Actions" },
  ];

  const reloadTopics = async () => {
    try {
      setLoading(true);

      const data = await fetchTopics(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setTopics(data.content || []);

      setPagination({
        totalElements: data.total_elements,
        totalPages: data.total_pages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error("Error loading topics:", err);
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadTopics();
  }, [query]); // reload khi query thay đổi

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleConfirmCreate = async (data) => {
    try {
      await createTopic(data);
      await reloadTopics();

      setIsCreateModalOpen(false);

      toast.success("Topic created successfully");
    } catch (error) {
      console.error("Error creating topic:", error);

      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0]); // chỉ hiển thị lỗi đầu tiên
      } else {
        toast.error("Failed to create topic");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-none">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Manage Topics
          </h2>

          <ToolBar
            updateQuery={updateQuery}
            setIsModalOpen={setIsCreateModalOpen}
          />

          <h4 className="mt-6 mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            Topics Table
          </h4>
        </div>

        {/* Bảng cuộn riêng */}
        <div className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm">
          <TopicsTable
            columns={columns}
            topics={topics}
            reloadTopics={reloadTopics}
            query={query}
            updateQuery={updateQuery}
          />
        </div>

        {/* Pagination */}
        <div className="flex-none mt-4">
          <Pagination
            query={query}
            updateQuery={updateQuery}
            pagination={pagination}
          />
        </div>
      </div>

      {/* Modal tạo topic */}
      {isCreateModalOpen && (
        <TopicFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleConfirmCreate}
        />
      )}
    </>
  );
};

export default ManageTopics;

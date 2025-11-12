import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createDictionaryEntry,
  fetchDictionary,
} from "../../../api/servers/dictionaryApi";
import ToolBar from "../../../components/servers/ToolBar";
import Pagination from "../../../components/servers/Pagination";
import DictionaryTable from "../../../components/servers/manage_dictionary_page/DictionaryTable";
import DictionaryFormModal from "../../../components/servers/manage_dictionary_page/DictionaryFormModal";

const ManageDictionary = () => {
  const [dictionary, setDictionary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State chung cho phân trang, sort, search
  const [query, setQuery] = useState({
    page: 1,
    size: 20,
    sortBy: "headword",
    direction: "asc",
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
    { key: "headword", label: "Headword", sortField: "headword" },
    { key: "ipa", label: "IPA", sortField: "ipa" },
    { key: "audioUrl", label: "Audio", sortField: "audioUrl" },
    { key: "updatedAt", label: "Updated At", sortField: "updatedAt" },
    { key: "actions", label: "Actions" },
  ];

  const reloadDictionary = async () => {
    try {
      setLoading(true);

      const data = await fetchDictionary(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setDictionary(data.content || []);

      // Lưu metadata cho pagination component
      setPagination({
        totalElements: data.total_elements,
        totalPages: data.total_pages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error("Error loading dictionary:", err);
      toast.error("Failed to load dictionary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadDictionary();
  }, [query]); // tự động reload khi query thay đổi

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleConfirmCreate = async (data) => {
    try {
      await createDictionaryEntry(data);
      await reloadDictionary();

      setIsCreateModalOpen(false);
      toast.success("Dictionary entry created successfully");
    } catch (error) {
      console.error("Error creating dictionary entry:", error);

      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0]); // chỉ hiển thị lỗi đầu tiên
      } else {
        toast.error("Failed to create dictionary entry");
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Dictionary
        </h2>

        <ToolBar
          updateQuery={updateQuery}
          setIsModalOpen={setIsCreateModalOpen}
        />

        <h4 className="mt-6 mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Dictionary Entries
        </h4>
      </div>

      {/* Vùng bảng cuộn riêng */}
      <div className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm">
        <DictionaryTable
          columns={columns}
          dictionary={dictionary}
          reloadDictionary={reloadDictionary}
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

      {/* Modal */}
      {isCreateModalOpen && (
        <DictionaryFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          mode="create"
          initialData={{}}
          onSubmit={handleConfirmCreate}
        />
      )}
    </div>
  );
};

export default ManageDictionary;

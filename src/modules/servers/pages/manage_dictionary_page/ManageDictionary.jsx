import { useEffect, useState, useRef, useCallback } from "react";
import ToolBar from "@/components/servers/ToolBar";
import Pagination from "@/components/servers/Pagination";
import DictionaryTable from "@/components/servers/manage_dictionary_page/DictionaryTable";
import DictionaryFormModal from "@/components/servers/manage_dictionary_page/DictionaryFormModal";
import DictionaryViewModal from "@/components/servers/manage_dictionary_page/DictionaryViewModal";
import Modal from "@/components/servers/Modal";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";
import { useDictionaryTable } from "@/hooks/servers/dictionary/useDictionaryTable";
import { useDictionaryCursor } from "@/hooks/servers/dictionary/useDictionaryCursor";
import {
  createWord as createWordApi,
  updateWord as updateWordApi,
  deleteWord as deleteWordApi,
} from "@/api/servers/dictionaryApi";
import toast from "react-hot-toast";

const ManageDictionary = () => {
  const { setHeader } = useHeaderContext();

  // Hook cho Search & Pagination
  const {
    data: tableData,
    pagination,
    query,
    setQuery,
    loading: tableLoading,
    handleCreate: tableCreate,
    handleDelete: tableDelete,
  } = useDictionaryTable();

  // Hook cho Infinite Scroll
  const {
    items: cursorData,
    setItems: setCursorItems,
    loadMore,
    loading: cursorLoading,
    hasMore,
  } = useDictionaryCursor(50);

  // Trạng thái chung
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedDictionary, setSelectedDictionary] = useState(null);

  // Cờ kiểm tra đang ở chế độ nào
  const isSearchMode = query.keyword && query.keyword.trim() !== "";
  const currentData = isSearchMode ? tableData : cursorData;
  const currentLoading = isSearchMode ? tableLoading : cursorLoading;

  useEffect(() => {
    setHeader({
      title: "Manage Dictionary",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage Dictionary" },
      ],
    });
    // Khởi tạo load dữ liệu cuộn vô tận lần đầu tiên
    if (!isSearchMode && cursorData.length === 0) {
      loadMore();
    }
  }, [setHeader, isSearchMode]);

  // Observer cho Infinite Scroll
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (currentLoading || isSearchMode) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [currentLoading, hasMore, isSearchMode, loadMore],
  );

  // Handler TẠO TỪ
  const handleConfirmCreate = async (word) => {
    if (isSearchMode) {
      await tableCreate(word);
    } else {
      // Logic add vào cursor data
      try {
        const res = await createWordApi(word);
        setCursorItems((prev) => [res, ...prev]); // Đẩy lên đầu danh sách
        toast.success("Created successfully");
      } catch (e) {
        console.error(e);
      }
    }
    setIsCreateModalOpen(false);
  };

  // Handler CẬP NHẬT TRỰC TIẾP TRÊN ROW (Inline Edit)
  const handleInlineUpdate = async (id, newWord) => {
    try {
      const res = await updateWordApi(id, newWord);
      if (isSearchMode) {
        // Cập nhật state table (giả sử bạn có handleUpdate trong hook, hoặc tự map lại data)
        setQuery({ ...query }); // trick re-fetch
      } else {
        setCursorItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, word: newWord } : item,
          ),
        );
      }
      toast.success("Updated successfully");
    } catch (e) {
      console.error(e);
      throw e; // Để Table component biết mà ko đóng mode edit
    }
  };

  // Handler XÓA TỪ
  const handleConfirmDelete = async () => {
    if (!selectedDictionary) return;
    if (isSearchMode) {
      await tableDelete(selectedDictionary.id);
    } else {
      try {
        await deleteWordApi(selectedDictionary.id);
        setCursorItems((prev) =>
          prev.filter((item) => item.id !== selectedDictionary.id),
        );
        toast.success("Deleted successfully");
      } catch (e) {
        console.error(e);
      }
    }
    setIsDeleteModalOpen(false);
    setSelectedDictionary(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      <div className="flex-none pb-4">
        <ToolBar
          updateQuery={(newQ) => setQuery((prev) => ({ ...prev, ...newQ }))}
          setIsModalOpen={setIsCreateModalOpen}
        />
      </div>

      <div className="flex-1 overflow-hidden border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col">
        <DictionaryTable
          dictionary={currentData}
          lastElementRef={lastElementRef}
          onViewClick={(item) => {
            setSelectedDictionary(item);
            setIsViewModalOpen(true);
          }}
          onDeleteClick={(item) => {
            setSelectedDictionary(item);
            setIsDeleteModalOpen(true);
          }}
          onInlineUpdate={handleInlineUpdate}
          loading={currentLoading}
        />
      </div>

      {isSearchMode && (
        <div className="flex-none mt-4">
          <Pagination
            query={query}
            updateQuery={(newQ) => setQuery((prev) => ({ ...prev, ...newQ }))}
            pagination={pagination}
          />
        </div>
      )}

      {/* VIEW MODAL */}
      <DictionaryViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedDictionary(null);
        }}
        dictionary={selectedDictionary}
      />

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <DictionaryFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleConfirmCreate}
        />
      )}

      {/* DELETE MODAL */}
      {selectedDictionary && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Entry
            </h2>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          }
        >
          <p className="text-gray-700">
            Are you sure you want to delete the word{" "}
            <strong className="text-gray-900">
              "{selectedDictionary.word}"
            </strong>
            ?
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This action is permanent and cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default ManageDictionary;

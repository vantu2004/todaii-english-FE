import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import AdminFormModal from "./AdminFormModal";
import { createAdmin } from "../../../api/servers/adminApi";
import { toast } from "react-hot-toast";

const ToolBar = ({ updateQuery, reloadAdmins }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // debounce: chờ user dừng gõ 500ms mới thực thi
  useEffect(() => {
    const delay = setTimeout(() => {
      updateQuery({ keyword: searchTerm, page: 1 });
    }, 500);

    return () => clearTimeout(delay); // cleanup mỗi lần gõ
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleConfirmCreate = async (data) => {
    try {
      await createAdmin(data);
      await reloadAdmins();

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating admin:", error);

      // Lấy danh sách lỗi từ response
      const errors = error.response?.data?.errors;

      if (errors && Array.isArray(errors)) {
        errors.forEach((err) => toast.error(err));
      } else {
        toast.error("Failed to create admin"); // fallback
      }
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* Ô tìm kiếm */}
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by id, name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        {/* Nút tạo admin */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Admin
        </button>
      </div>

      {/* Modal tạo admin */}
      <AdminFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={"create"} // "create" hoặc "update"
        initialData={{}} // khi tạo nên set initialData = {}
        onSubmit={handleConfirmCreate}
      />
    </>
  );
};

export default ToolBar;

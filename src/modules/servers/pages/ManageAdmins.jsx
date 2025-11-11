import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminsTable from "../../../components/servers/manage_admins_page/AdminsTable";
import { fetchAdmins, createAdmin } from "../../../api/servers/adminApi";
import ToolBar from "../../../components/servers/ToolBar";
import Pagination from "../../../components/servers/Pagination";
import AdminFormModal from "../../../components/servers/manage_admins_page/AdminFormModal";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
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
    { key: "email_name", label: "Name/Email", sortField: "displayName" },
    { key: "role", label: "Role" },
    { key: "lastLogin", label: "Last Login", sortField: "lastLoginAt" },
    { key: "createdAt", label: "Created At", sortField: "createdAt" },
    { key: "status", label: "Status", sortField: "status" },
    { key: "enable", label: "Enable", sortField: "enabled" },
    { key: "actions", label: "Actions" },
  ];

  const reloadAdmins = async () => {
    try {
      setLoading(true);

      const data = await fetchAdmins(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setAdmins(data.content || []);

      // Lưu metadata cho pagination component
      setPagination({
        totalElements: data.total_elements,
        totalPages: data.total_pages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error("Error loading admins:", err);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadAdmins();
  }, [query]); // tự động reload admins khi query thay đổi

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleConfirmCreate = async (data) => {
    try {
      await createAdmin(data);
      await reloadAdmins();

      setIsCreateModalOpen(false);

      toast.success("Admin created successfully");
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
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Admins
        </h2>

        <ToolBar
          updateQuery={updateQuery}
          setIsModalOpen={setIsCreateModalOpen}
        />

        <h4 className="mt-6 mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Table with actions
        </h4>
      </div>

      {/* Vùng bảng cuộn riêng */}
      <div className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm">
        <AdminsTable
          columns={columns}
          admins={admins}
          reloadAdmins={reloadAdmins}
          query={query}
          updateQuery={updateQuery}
        />
      </div>

      {/* Pagination nằm ngoài, cố định dưới cùng */}
      <div className="flex-none mt-4">
        <Pagination
          query={query}
          updateQuery={updateQuery}
          pagination={pagination}
        />
      </div>

      {/* Modal */}
      {isCreateModalOpen && (
        <AdminFormModal
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

export default ManageAdmins;

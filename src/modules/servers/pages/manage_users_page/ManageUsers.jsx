import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ToolBar from "../../../../components/servers/ToolBar";
import Pagination from "../../../../components/servers/Pagination";
import { fetchUsers } from "../../../../api/servers/userApi";
import UsersTable from "../../../../components/servers/manage_users_page/UsersTable";
import { motion } from "framer-motion";
import { logError } from "../../../../utils/LogError";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";

const ManageUsers = () => {
  const { setHeader } = useHeaderContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { key: "dashboard", label: "Dashboard" },
    { key: "actions", label: "Actions" },
  ];

  const reloadUsers = async () => {
    try {
      setLoading(true);

      const data = await fetchUsers(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setUsers(data.content || []);

      // Lưu metadata cho pagination component
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
    setHeader({
      title: "Manage Users",
      breadcrumb: [{ label: "Home", to: "/server" }, { label: "Manage Users" }],
    });
  }, []);

  useEffect(() => {
    reloadUsers();
  }, [query]); // tự động reload users khi query thay đổi

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  return (
    <div className="flex flex-col h-full">
      <ToolBar updateQuery={updateQuery} setIsModalOpen={null} />

      {/* Vùng bảng cuộn riêng */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <UsersTable
          columns={columns}
          users={users}
          reloadUsers={reloadUsers}
          query={query}
          updateQuery={updateQuery}
        />
      </motion.div>

      {/* Pagination nằm ngoài, cố định dưới cùng */}
      <div className="flex-none mt-4">
        <Pagination
          query={query}
          updateQuery={updateQuery}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default ManageUsers;

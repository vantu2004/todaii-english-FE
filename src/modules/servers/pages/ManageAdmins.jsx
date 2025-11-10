import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminsTable from "../../../components/servers/manage_admins_page/AdminsTable";
import { fetchAdmins } from "../../../api/servers/adminApi";
import ToolBar from "../../../components/servers/manage_admins_page/ToolBar";
import { motion } from "framer-motion";
import Pagination from "../../../components/servers/manage_admins_page/Pagination";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
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

  return (
    <main className="h-full pb-16 overflow-y-auto">
      <div className="container grid px-6 mx-auto">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Admins
        </h2>

        <ToolBar updateQuery={updateQuery} reloadAdmins={reloadAdmins} />

        <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Table with actions
        </h4>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-12 h-12 border-4 border-t-indigo-500 border-gray-300 rounded-full"
            ></motion.div>
            <p className="mt-4 text-gray-500">Loading admins...</p>
          </div>
        ) : (
          <div className="border border-gray-300 w-full overflow-hidden rounded-lg shadow-xs">
            <div className="w-full overflow-x-auto">
              <AdminsTable
                columns={columns}
                admins={admins}
                reloadAdmins={reloadAdmins}
                query={query}
                updateQuery={updateQuery}
              />

              <Pagination
                query={query}
                updateQuery={updateQuery}
                pagination={pagination}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ManageAdmins;

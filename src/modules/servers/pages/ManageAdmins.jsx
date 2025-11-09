import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminsTable from "../../../components/servers/manage_admins_page/AdminsTable";
import { fetchAdmins } from "../../../api/servers/adminApi";
import ToolBar from "../../../components/servers/manage_admins_page/ToolBar";

const ManageAdmins2 = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: "id", label: "ID" },
    { key: "email_name", label: "Name/Email" },
    { key: "role", label: "Role" },
    { key: "lastLogin", label: "Last Login" },
    { key: "createdAt", label: "Created At" },
    { key: "status", label: "Status" },
    { key: "enable", label: "Enable" },
    { key: "actions", label: "Actions" },
  ];

  const reloadAdmins = async () => {
    try {
      setLoading(true);
      // ko truyền tham số, để mặc định của api
      const data = await fetchAdmins();
      setAdmins(data.content || []);
    } catch (err) {
      console.error("Error loading admins:", err);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadAdmins();
  }, []);

  return (
    <main className="h-full pb-16 overflow-y-auto">
      <div className="container grid px-6 mx-auto">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Admins
        </h2>

        <ToolBar />

        <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Table with actions
        </h4>

        <AdminsTable
          columns={columns}
          admins={admins}
          reloadAdmins={reloadAdmins}
        />
      </div>
    </main>
  );
};

export default ManageAdmins2;

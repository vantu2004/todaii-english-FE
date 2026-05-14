import { useEffect, useState } from "react";
import { formatISODate } from "@/utils/FormatDate";
import { deleteAdmin, toggleAdmin, updateAdmin } from "@/api/servers/adminApi";
import toast from "react-hot-toast";
import Modal from "@/components/servers/Modal";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  LayoutDashboard,
} from "lucide-react";
import AdminFormModal from "./AdminFormModal";
import AdminViewModal from "./AdminViewModal";
import { logError } from "@/utils/LogError";
import { useNavigate } from "react-router-dom";

const AdminsTable = ({ columns, admins, reloadAdmins, query, updateQuery }) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdminIndex, setSelectedAdminIndex] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setEnabledStates(admins.map((admin) => admin.enabled));
  }, [admins]);

  const handleToggle = async (index) => {
    setEnabledStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    const togglePromise = (async () => {
      const adminId = admins[index].id;
      await toggleAdmin(adminId);
      await reloadAdmins();
    })();

    toast.promise(togglePromise, {
      loading: "Updating status...",
      success: "Status updated successfully",
      error: "Failed to update status",
    });

    try {
      await togglePromise;
    } catch (err) {
      logError(err);
      setEnabledStates((prev) => {
        const newStates = [...prev];
        newStates[index] = !newStates[index];
        return newStates;
      });
    }
  };

  const handleDashboardClick = (index) => {
    navigate(`/server/admin/${admins[index].id}/dashboard`);
  };

  const handleViewClick = (index) => {
    setSelectedAdmin(admins[index]);
    setIsViewModalOpen(true);
  };

  const handleUpdateClick = (index) => {
    setSelectedAdminIndex(index);
    setSelectedAdmin(admins[index]);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (index) => {
    setSelectedAdminIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmUpdate = async (data) => {
    if (selectedAdminIndex === null) return;
    const updatePromise = (async () => {
      const adminId = admins[selectedAdminIndex].id;
      await updateAdmin(adminId, data);
      await reloadAdmins();
    })();
    toast.promise(updatePromise, {
      loading: "Updating admin...",
      success: "Admin updated successfully",
      error: "Failed to update admin",
    });
    try {
      await updatePromise;
      setSelectedAdminIndex(null);
      setSelectedAdmin(null);
      setIsUpdateModalOpen(false);
    } catch (error) {
      logError(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedAdminIndex === null) return;
    const deletePromise = (async () => {
      const adminId = admins[selectedAdminIndex].id;
      await deleteAdmin(adminId);
      await reloadAdmins();
    })();
    toast.promise(deletePromise, {
      loading: "Deleting admin...",
      success: "Admin deleted successfully",
      error: "Failed to delete admin",
    });
    try {
      await deletePromise;
      setSelectedAdminIndex(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      logError(err);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;
                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${isSortable ? "cursor-pointer select-none hover:text-gray-900 dark:hover:text-white" : ""}`}
                    onClick={() => {
                      if (!isSortable) return;
                      const newDirection = isActiveSort
                        ? query.direction === "asc"
                          ? "desc"
                          : "asc"
                        : "asc";
                      updateQuery({
                        sortBy: col.sortField,
                        direction: newDirection,
                        page: query.page,
                      });
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {isSortable && isActiveSort && (
                        <span className="inline-flex items-center">
                          {query.direction === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-gray-900 dark:text-white" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-gray-900 dark:text-white" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-800/50 dark:bg-gray-900">
            {admins.map((admin, i) => {
              const statusPill =
                admin.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : admin.status === "PENDING"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";

              return (
                <tr
                  key={i}
                  className="text-gray-900 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 text-sm">{admin.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src={
                            admin.avatar_url ||
                            "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
                          }
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">{admin.display_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {admin.roles.map((role, index) => (
                        <span
                          key={role.id || index}
                          className="px-2 py-0.5 font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                          {role.description}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatISODate(admin.last_login_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatISODate(admin.created_at)}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`px-2 py-0.5 font-medium ${statusPill} rounded-md`}
                    >
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleToggle(i)}
                      className={`relative cursor-pointer w-10 h-5 rounded-full border transition-colors duration-300 ease-in-out ${enabledStates[i] ? "bg-green-400 border-green-400" : "bg-gray-300 border-gray-200"}`}
                    >
                      <div
                        className={`absolute top-1/2 left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${enabledStates[i] ? "translate-x-5" : "translate-x-0"}`}
                      ></div>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDashboardClick(i)}
                      className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                      aria-label="Dashboard"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1 text-sm">
                      <button
                        onClick={() => handleViewClick(i)}
                        className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                        aria-label="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateClick(i)}
                        className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                        aria-label="Update"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(i)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedAdmin && (
        <AdminViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          admin={selectedAdmin || {}}
        />
      )}
      {selectedAdmin && (
        <AdminFormModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          mode={"update"}
          initialData={selectedAdmin || {}}
          onSubmit={handleConfirmUpdate}
        />
      )}

      {selectedAdminIndex !== null && selectedAdminIndex !== undefined && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Admin"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleConfirmDelete();
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          }
        >
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete this administrator? This action
              cannot be undone.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800 mb-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {selectedAdminIndex !== null
                  ? admins[selectedAdminIndex].display_name
                  : ""}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedAdminIndex !== null
                  ? admins[selectedAdminIndex].email
                  : ""}
              </p>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              ⚠️ This action is permanent. The admin account and all associated
              permissions will be deleted.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminsTable;

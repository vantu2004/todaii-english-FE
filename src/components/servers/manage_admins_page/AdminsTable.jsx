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
  AlertTriangle,
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
      const newStates = [...prev]; // get old states
      newStates[index] = !newStates[index]; // toggle
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
        const newStates = [...prev]; // get old states
        newStates[index] = !newStates[index]; // toggle
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
    // lây dữ liệu chuẩn bị cho initial value
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
          {/* === Table Header === */}
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-neutral-500 uppercase border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;

                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${
                      isSortable
                        ? "cursor-pointer select-none hover:text-neutral-900 dark:hover:text-white transition-colors"
                        : ""
                    }`}
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
                            <ArrowUp className="w-3 h-3 text-neutral-900 dark:text-white" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-neutral-900 dark:text-white" />
                          )}
                        </span>
                      )}
                      {isSortable && !isActiveSort && (
                        <span className="inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUp className="w-3 h-3 text-neutral-400" />
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* === Table Body === */}
          <tbody className="bg-white divide-y devide-neutral-100 dark:divide-neutral-800/50 dark:bg-neutral-900">
            {admins.map((admin, i) => {
              const statusPill =
                admin.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                  : admin.status === "PENDING"
                    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
                    : "bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20";

              return (
                <tr
                  key={i}
                  className="border-t border-neutral-100 dark:border-neutral-800/50 text-neutral-900 dark:text-neutral-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  {/* ID */}
                  <td className="px-4 py-3 text-sm">{admin.id}</td>

                  {/* Admin name + avatar + email*/}
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
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Roles */}
                  <td className="px-4 py-3 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {admin.roles.map((role, index) => (
                        <span
                          key={role.id || index}
                          className="px-2 py-1 font-semibold leading-tight rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 ring-1 ring-neutral-200 dark:ring-neutral-700"
                        >
                          {role.description}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Last login */}
                  <td className="px-4 py-3 text-sm">
                    {formatISODate(admin.last_login_at)}
                  </td>

                  {/* Created at */}
                  <td className="px-4 py-3 text-sm">
                    {formatISODate(admin.created_at)}
                  </td>

                  {/* Status pill */}
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`px-2 py-1 font-semibold leading-tight ${statusPill} rounded-full `}
                    >
                      {admin.status}
                    </span>
                  </td>

                  {/* Enable button */}
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleToggle(i)}
                      className={`relative cursor-pointer w-10 h-5 rounded-full border transition-colors duration-300 ease-in-out ${
                        enabledStates[i]
                          ? "bg-green-400 border-green-400"
                          : "bg-neutral-300 border-neutral-200"
                      }`}
                    >
                      <div
                        className={`absolute top-1/2 left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${
                          enabledStates[i] ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </td>

                  {/* Dashboard */}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center text-sm">
                      <button
                        onClick={() => handleDashboardClick(i)}
                        className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        aria-label="Vocabulary"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1 text-sm">
                      {/* Nút xem */}
                      <button
                        onClick={() => handleViewClick(i)}
                        className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        aria-label="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* Nút sửa */}
                      <button
                        onClick={() => handleUpdateClick(i)}
                        className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        aria-label="Update"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>

                      {/* Nút xóa */}
                      <button
                        onClick={() => handleDeleteClick(i)}
                        className="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal view admin */}
      {selectedAdmin && (
        <AdminViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          admin={selectedAdmin || {}}
        />
      )}

      {/* Modal update admin */}
      {selectedAdmin && (
        <AdminFormModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          mode={"update"} // "create" hoặc "update"
          initialData={selectedAdmin || {}} // khi tạo nên set initialData = {}
          onSubmit={handleConfirmUpdate}
        />
      )}

      {/* Modal delete admin */}
      {selectedAdminIndex !== null && selectedAdminIndex !== undefined && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Delete Admin
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleConfirmDelete();
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Admin
              </button>
            </div>
          }
        >
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 ring-1 ring-neutral-200 dark:ring-neutral-800">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 text-base">
                  Are you sure you want to delete this administrator?
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  You are about to permanently delete the admin account:
                </p>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-3 ring-1 ring-neutral-200 dark:ring-neutral-800 mb-4">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {selectedAdminIndex !== null
                      ? admins[selectedAdminIndex].display_name
                      : ""}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {selectedAdminIndex !== null
                      ? admins[selectedAdminIndex].email
                      : ""}
                  </p>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                  ⚠️ This action is permanent and cannot be reversed. The admin
                  account and all associated permissions will be deleted.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AdminsTable;

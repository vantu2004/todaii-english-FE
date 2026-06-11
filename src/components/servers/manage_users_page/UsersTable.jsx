import { useEffect, useState } from "react";
import { formatISODate } from "@/utils/FormatDate";
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
import UserViewModal from "./UserViewModal";
import { updateUser, toggleUser, deleteUser } from "@/api/servers/userApi";
import UserFormModal from "./UserFormModal";
import { logError } from "@/utils/LogError";
import { useNavigate } from "react-router-dom";

const UsersTable = ({ columns, users, reloadUsers, query, updateQuery }) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setEnabledStates(users.map((user) => user.enabled));
  }, [users]);

  const handleToggle = async (index) => {
    setEnabledStates((prev) => {
      const s = [...prev];
      s[index] = !s[index];
      return s;
    });
    const togglePromise = (async () => {
      await toggleUser(users[index].id);
      await reloadUsers();
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
        const s = [...prev];
        s[index] = !s[index];
        return s;
      });
    }
  };

  const handleDashboardClick = (index) =>
    navigate(`/server/user/${users[index].id}/dashboard`);
  const handleViewClick = (index) => {
    setSelectedUser(users[index]);
    setIsViewModalOpen(true);
  };
  const handleUpdateClick = (index) => {
    setSelectedUserIndex(index);
    setSelectedUser(users[index]);
    setIsUpdateModalOpen(true);
  };
  const handleDeleteClick = (index) => {
    setSelectedUserIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmUpdate = async (data) => {
    if (selectedUserIndex === null) return;
    const p = (async () => {
      await updateUser(users[selectedUserIndex].id, data);
      await reloadUsers();
    })();
    toast.promise(p, {
      loading: "Updating user...",
      success: "User updated successfully",
      error: "Failed to update user",
    });
    try {
      await p;
      setSelectedUserIndex(null);
      setSelectedUser(null);
      setIsUpdateModalOpen(false);
    } catch (error) {
      logError(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedUserIndex === null) return;
    const p = (async () => {
      await deleteUser(users[selectedUserIndex].id);
      await reloadUsers();
    })();
    toast.promise(p, {
      loading: "Deleting user...",
      success: "User deleted successfully",
      error: "Failed to delete user",
    });
    try {
      await p;
      setSelectedUserIndex(null);
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
                      const dir = isActiveSort
                        ? query.direction === "asc"
                          ? "desc"
                          : "asc"
                        : "asc";
                      updateQuery({
                        sortBy: col.sortField,
                        direction: dir,
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
            {users.map((user, i) => {
              const statusPill =
                user.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : user.status === "PENDING"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
              return (
                <tr
                  key={i}
                  className="text-gray-900 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 text-sm font-semibold">{user.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src={
                            user.avatar_url ||
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
                        <p className="font-semibold">{user.display_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="px-2 py-0.5 font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      User
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatISODate(user.last_login_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatISODate(user.created_at)}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`px-2 py-0.5 font-medium ${statusPill} rounded-md`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleToggle(i)}
                      className={`relative cursor-pointer w-10 h-5 rounded-full border transition-colors duration-300 ${enabledStates[i] ? "bg-green-400 border-green-400" : "bg-gray-300 border-gray-200"}`}
                    >
                      <div
                        className={`absolute top-1/2 left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transform -translate-y-1/2 transition-transform duration-300 ${enabledStates[i] ? "translate-x-5" : "translate-x-0"}`}
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
                    <div className="flex items-center space-x-4 text-sm">
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

      {selectedUser && (
        <UserViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          user={selectedUser}
        />
      )}
      {selectedUser && (
        <UserFormModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          mode="update"
          initialData={selectedUser}
          onSubmit={handleConfirmUpdate}
        />
      )}

      {selectedUserIndex !== null && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete User"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          }
        >
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800 mb-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {selectedUserIndex !== null
                  ? users[selectedUserIndex].display_name
                  : ""}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedUserIndex !== null
                  ? users[selectedUserIndex].email
                  : ""}
              </p>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              ⚠️ This action is permanent. All data associated with this account
              will be deleted.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UsersTable;

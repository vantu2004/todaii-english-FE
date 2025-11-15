import { useEffect, useState } from "react";
import { formatISODate } from "../../../utils/FormatDate";
import toast from "react-hot-toast";
import Modal from "../Modal";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";
import UserViewModal from "./UserViewModal";
import {
  updateUser,
  toggleUser,
  deleteUser,
} from "../../../api/servers/userApi";
import UserFormModal from "./UserFormModal";
import { logError } from "../../../utils/LogError";

const UsersTable = ({ columns, users, reloadUsers, query, updateQuery }) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    setEnabledStates(users.map((user) => user.enabled));
  }, [users]);

  const handleToggle = async (index) => {
    setEnabledStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    try {
      const userId = users[index].id;
      await toggleUser(userId);
      await reloadUsers();
    } catch (err) {
      logError(err);
    }
  };

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

    try {
      const userId = users[selectedUserIndex].id;

      await updateUser(userId, data);
      await reloadUsers();

      setSelectedUserIndex(null);
      setSelectedUser(null);
      setIsUpdateModalOpen(false);

      toast.success("User updated successfully");
    } catch (error) {
      logError(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedUserIndex === null) return;

    try {
      const userId = users[selectedUserIndex].id;

      await deleteUser(userId);
      await reloadUsers();

      setSelectedUserIndex(null);
      setIsDeleteModalOpen(false);

      toast.success("User deleted");
    } catch (err) {
      logError(err);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;

                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${
                      isSortable
                        ? "cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                            <ArrowUp className="w-3 h-3 text-blue-600" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-blue-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white divide-y devide-gray-300 dark:divide-gray-700 dark:bg-gray-800">
            {users.map((user, i) => {
              const statusPill =
                user.status === "ACTIVE"
                  ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                  : user.status === "PENDING"
                  ? "text-orange-700 bg-orange-100 dark:text-orange:100 dark:bg-orange-700"
                  : "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700";

              return (
                <tr
                  key={i}
                  className="border-t border-gray-300 text-gray-700 dark:text-gray-400"
                >
                  <td className="px-4 py-3 text-xs">
                    <span className={"font-semibold"}>{user.id}</span>
                  </td>

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
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 font-semibold leading-tight rounded-full bg-blue-100 text-blue-700">
                        User
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {formatISODate(user.last_login_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatISODate(user.created_at)}
                  </td>

                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`px-2 py-1 font-semibold leading-tight ${statusPill} rounded-full`}
                    >
                      {user.status}
                    </span>
                  </td>

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

                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <button
                        onClick={() => handleViewClick(i)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleUpdateClick(i)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        aria-label="Update"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(i)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Modal view user */}
      {selectedUser && (
        <UserViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          user={selectedUser}
        />
      )}

      {/* Modal update user */}
      {selectedUser && (
        <UserFormModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          mode="update"
          initialData={selectedUser}
          onSubmit={handleConfirmUpdate}
        />
      )}

      {/* Modal delete user */}
      {selectedUserIndex !== null && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-100 to-red-50 rounded-lg">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Delete User
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete User
              </button>
            </div>
          }
        >
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border-2 border-red-200/50">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  Are you sure you want to delete this user?
                </h3>
                <p className="text-gray-700 mb-4">
                  You are about to permanently delete the user account:
                </p>
                <div className="bg-white rounded-lg p-3 border border-red-300 mb-4">
                  <p className="text-sm font-semibold text-red-700">
                    {selectedUserIndex !== null
                      ? users[selectedUserIndex].display_name
                      : ""}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedUserIndex !== null
                      ? users[selectedUserIndex].email
                      : ""}
                  </p>
                </div>
                <p className="text-xs text-red-600 leading-relaxed">
                  ⚠️ This action is permanent and cannot be reversed. All data
                  associated with this account will be deleted.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UsersTable;

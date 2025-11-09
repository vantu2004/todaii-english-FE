import { useEffect, useState } from "react";

import { formatDate } from "./../../../utils/FormatDate";
import { deleteAdmin, toggleAdmin } from "../../../api/servers/adminApi";
import toast from "react-hot-toast";
import Modal from "../Modal";
import { Eye, Pencil, Trash2 } from "lucide-react";

const AdminsTable = ({ columns, admins, reloadAdmins }) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdminIndex, setSelectedAdminIndex] = useState(null);

  useEffect(() => {
    setEnabledStates(admins.map((admin) => admin.enabled));
  }, [admins]);

  const handleToggle = async (index) => {
    setEnabledStates((prev) => {
      const newStates = [...prev]; // get old states
      newStates[index] = !newStates[index]; // toggle
      return newStates;
    });

    try {
      const adminId = admins[index].id;
      await toggleAdmin(adminId);
      await reloadAdmins();
    } catch (err) {
      toast.error("Failed to toggle admin");
      console.error("Failed to toggle admin:", err);
    }
  };

  const handleDeleteClick = (index) => {
    setSelectedAdminIndex(index);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedAdminIndex === null) return;

    try {
      const adminId = admins[selectedAdminIndex].id;
      await deleteAdmin(adminId);
      await reloadAdmins();
    } catch (err) {
      toast.error("Failed to delete admin");
      console.error("Failed to delete admin:", err);
    } finally {
      setIsModalOpen(false);
      setSelectedAdminIndex(null);
    }
  };

  return (
    <div className="border border-gray-300 w-full overflow-hidden rounded-lg shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          {/* === Table Header === */}
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* === Table Body === */}
          <tbody className="bg-white divide-y devide-gray-300 dark:divide-gray-700 dark:bg-gray-800">
            {admins.map((admin, i) => {
              const statusPill =
                admin.status === "ACTIVE"
                  ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                  : admin.status === "PENDING"
                  ? "text-orange-700 bg-orange-100 dark:text-orange:100 dark:bg-orange-700"
                  : "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700";

              return (
                <tr
                  key={i}
                  className="border-t border-gray-300 text-gray-700 dark:text-gray-400"
                >
                  {/* ID */}
                  <td className="px-4 py-3 text-xs">
                    <span className={"font-semibold"}>{admin.id}</span>
                  </td>

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
                        <p className="text-xs text-gray-600 dark:text-gray-400">
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
                          className="px-2 py-1 font-semibold leading-tight rounded-full bg-blue-100 text-blue-700"
                        >
                          {role.description}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Last login */}
                  <td className="px-4 py-3 text-sm">
                    {formatDate(admin.last_login_at)}
                  </td>

                  {/* Created at */}
                  <td className="px-4 py-3 text-sm">
                    {formatDate(admin.created_at)}
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

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3 text-sm">
                      {/* Nút xem */}
                      <button
                        onClick={() => handleViewClick(i)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {/* Nút sửa */}
                      <button
                        onClick={() => handleEditClick(i)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>

                      {/* Nút xóa */}
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

        <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
          <span class="flex items-center col-span-3">Showing 21-30 of 100</span>
          <span class="col-span-2"></span>
          {/* Pagination */}
          <span class="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
            <nav aria-label="Table navigation">
              <ul class="inline-flex items-center">
                <li>
                  <button
                    class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                    aria-label="Previous"
                  >
                    <svg
                      class="w-4 h-4 fill-current"
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </li>
                <li>
                  <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                    1
                  </button>
                </li>
                <li>
                  <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                    2
                  </button>
                </li>
                <li>
                  <button class="px-3 py-1 text-white transition-colors duration-150 bg-purple-600 border border-r-0 border-purple-600 rounded-md focus:outline-none focus:shadow-outline-purple">
                    3
                  </button>
                </li>
                <li>
                  <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                    4
                  </button>
                </li>
                <li>
                  <span class="px-3 py-1">...</span>
                </li>
                <li>
                  <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                    8
                  </button>
                </li>
                <li>
                  <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple">
                    9
                  </button>
                </li>
                <li>
                  <button
                    class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                    aria-label="Next"
                  >
                    <svg
                      class="w-4 h-4 fill-current"
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </span>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        header="Delete Admin"
        body={`Are you sure you want to delete ${
          selectedAdminIndex !== null
            ? admins[selectedAdminIndex].display_name
            : ""
        }?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default AdminsTable;

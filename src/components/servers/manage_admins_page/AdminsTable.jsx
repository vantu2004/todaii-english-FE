import React, { useEffect, useState } from "react";

import { formatDate } from "./../../../utils/FormatDate";
import { deleteAdmin, toggleAdmin } from "../../../api/servers/adminApi";
import toast from "react-hot-toast";
import Modal from "../Modal";

const AdminsTable = ({ columns, admins, reloadAdmins }) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdminIndex, setSelectedAdminIndex] = useState(null);

  useEffect(() => {
    setEnabledStates(admins.map((admin) => admin.enabled));
  }, [admins]);

  console.log(enabledStates);

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
                  <td className="px-4 py-3 text-sm">
                    {/* Admin name + avatar + email*/}
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

                    {/* Enable button */}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleToggle(i)}
                      className={`relative cursor-pointer w-14 h-7 rounded-full border-2 transition-colors duration-300 ease-in-out 
                        ${
                          enabledStates[i]
                            ? "bg-green-400 border-green-400"
                            : "bg-neutral-300 border-neutral-200"
                        }`}
                    >
                      <div
                        className={`absolute top-[-1.5px]  w-6 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out
                          ${
                            enabledStates[i]
                              ? "translate-x-8"
                              : "-translate-x-1"
                          }`}
                      ></div>
                    </button>
                  </td>

                  {/* Status pill */}

                  <td className="px-4 py-3 text-xs">
                    <span
                      className={`px-2 py-1 font-semibold leading-tight ${statusPill} rounded-full `}
                    >
                      {admin.status}
                    </span>
                  </td>

                  {/* Created at */}

                  <td className="px-4 py-3 text-sm">
                    {formatDate(admin.created_at)}
                  </td>

                  {/* Last login */}

                  <td className="px-4 py-3 text-sm">
                    {formatDate(admin.last_login_at)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-4 text-sm">
                      <button
                        onClick={() => handleDeleteClick(i)}
                        className="cursor-pointer flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-red-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                        aria-label="Delete"
                      >
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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

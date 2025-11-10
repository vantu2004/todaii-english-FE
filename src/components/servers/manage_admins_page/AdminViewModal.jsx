import { useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Key,
} from "lucide-react";
import Modal from "../Modal";
import { formatDate } from "./../../../utils/FormatDate";

const AdminViewModal = ({ isOpen, onClose, admin }) => {
  if (!admin) return null;

  const statusStyles = {
    ACTIVE: "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
    PENDING:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100",
    INACTIVE: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Details"
      width="sm:max-w-md"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {admin.avatar_url ? (
            <img
              src={admin.avatar_url}
              alt={admin.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          )}
        </div>

        {/* Name & Email */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {admin.display_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            <Mail className="w-4 h-4" /> {admin.email}
          </p>
        </div>

        {/* Info grid */}
        <div className="w-full grid grid-cols-1 gap-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Status:
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                statusStyles[admin.status] ||
                "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100"
              }`}
            >
              {admin.status}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Enabled:
            </span>
            {admin.enabled ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Created At:
            </span>
            <span className="text-gray-700 dark:text-gray-200">
              {formatDate(admin.created_at)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Updated At:
            </span>
            <span className="text-gray-700 dark:text-gray-200">
              {formatDate(admin.updated_at)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Last Login:
            </span>
            <span className="text-gray-700 dark:text-gray-200">
              {formatDate(admin.last_login_at)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Roles:
            </span>
            <div className="flex flex-wrap gap-1 justify-end">
              {admin.roles.map((role) => (
                <span
                  key={role.code}
                  className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100"
                >
                  {role.description}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AdminViewModal;

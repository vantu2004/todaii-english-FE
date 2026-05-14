import { User, Mail, CheckCircle, XCircle } from "lucide-react";
import Modal from "@/components/servers/Modal";
import { formatISODate } from "@/utils/FormatDate";

const AdminViewModal = ({ isOpen, onClose, admin }) => {
  if (!admin) return null;

  const statusConfig = {
    ACTIVE: {
      color: "text-emerald-700 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      label: "Active",
    },
    PENDING: {
      color: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      label: "Pending",
    },
    INACTIVE: {
      color: "text-red-700 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-500/10",
      label: "Inactive",
    },
  };

  const status = statusConfig[admin.status] || statusConfig.ACTIVE;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Profile"
      width="sm:max-w-2xl"
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              {admin.avatar_url ? (
                <img
                  src={admin.avatar_url}
                  alt={admin.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 ${status.bg} ${status.color} px-2 py-0.5 rounded-md text-xs font-medium border-2 border-white dark:border-gray-900`}
            >
              {status.label}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {admin.display_name}
            </h3>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
              <Mail size={14} />
              <span>{admin.email}</span>
            </div>
            {admin.enabled ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-md text-xs font-medium">
                <CheckCircle size={12} /> Enabled
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-md text-xs font-medium">
                <XCircle size={12} /> Disabled
              </span>
            )}
          </div>
        </div>

        {/* Roles */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Roles & Permissions
          </h4>
          <div className="flex flex-wrap gap-2">
            {admin.roles?.length > 0 ? (
              admin.roles.map((role) => (
                <span
                  key={role.code}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md text-sm font-medium"
                >
                  {role.description}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No roles assigned
              </p>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Activity
          </h4>
          <div className="space-y-3">
            <InfoRow
              label="Account Created"
              value={formatISODate(admin.created_at)}
            />
            <InfoRow
              label="Last Updated"
              value={formatISODate(admin.updated_at)}
            />
            <InfoRow
              label="Last Login"
              value={formatISODate(admin.last_login_at)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Status
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {admin.status}
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Total Roles
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {admin.roles?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-900 dark:text-white">
      {value}
    </span>
  </div>
);

export default AdminViewModal;

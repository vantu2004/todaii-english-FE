import {
  User,
  Mail,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  UserCircle,
  Eye,
} from "lucide-react";
import Modal from "@/components/servers/Modal";
import { formatISODate } from "@/utils/FormatDate";

const UserViewModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  const statusConfig = {
    ACTIVE: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", label: "Active" },
    PENDING: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", label: "Pending" },
    INACTIVE: { color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", label: "Inactive" },
  };

  const status = statusConfig[user.status] || statusConfig.ACTIVE;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <Eye className="text-neutral-700 dark:text-neutral-300" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">User Profile</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">View user information</p>
          </div>
        </div>
      }
      width="sm:max-w-2xl"
    >
      <div className="space-y-5">
        {/* Profile Header */}
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-6 ring-1 ring-neutral-200 dark:ring-neutral-800">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shadow-sm border-2 border-white dark:border-neutral-900">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                ) : (
                  <User className="w-10 h-10 text-neutral-400" />
                )}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 ${status.bg} ${status.color} px-2.5 py-0.5 rounded-full text-xs font-bold border-2 border-white dark:border-neutral-900 shadow-sm`}
              >
                {status.label}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                {user.display_name}
              </h3>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>

              {/* Enabled Badge */}
              {user.enabled ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold ring-1 ring-emerald-600/20 dark:ring-emerald-500/20">
                  <CheckCircle size={14} />
                  Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 rounded-full text-xs font-semibold ring-1 ring-red-600/20 dark:ring-red-500/20">
                  <XCircle size={14} />
                  Disabled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* User Role */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 ring-1 ring-neutral-200 dark:ring-neutral-800">
          <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
            <UserCircle size={16} className="text-neutral-500 dark:text-neutral-400" />
            User Role
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm font-medium ring-1 ring-neutral-200 dark:ring-neutral-700 w-fit">
              <UserCircle size={14} />
              <span>Standard User</span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 italic">
              Default role for all registered users
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 ring-1 ring-neutral-200 dark:ring-neutral-800">
          <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
            <Calendar size={16} className="text-neutral-500 dark:text-neutral-400" />
            Activity Timeline
          </h4>
          <div className="space-y-3">
            <InfoRow
              icon={Calendar}
              label="Account Created"
              value={formatISODate(user.created_at)}
            />
            <InfoRow
              icon={Clock}
              label="Last Updated"
              value={formatISODate(user.updated_at)}
            />
            <InfoRow
              icon={CheckCircle}
              label="Last Login"
              value={formatISODate(user.last_login_at)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 p-5 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                Status
              </span>
              <CheckCircle size={16} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {user.status}
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 p-5 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                User Type
              </span>
              <UserCircle size={16} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">Standard</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
    <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg ring-1 ring-neutral-200 dark:ring-neutral-700 flex-shrink-0">
      <Icon size={14} className="text-neutral-500 dark:text-neutral-400" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
        {value}
      </div>
    </div>
  </div>
);

export default UserViewModal;

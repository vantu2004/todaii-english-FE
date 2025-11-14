import {
  User,
  Mail,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Shield,
  Eye,
} from "lucide-react";
import Modal from "../Modal";
import { formatISODate } from "./../../../utils/FormatDate";

const AdminViewModal = ({ isOpen, onClose, admin }) => {
  if (!admin) return null;

  const statusConfig = {
    ACTIVE: { color: "text-green-600", bg: "bg-green-50", label: "Active" },
    PENDING: { color: "text-yellow-600", bg: "bg-yellow-50", label: "Pending" },
    INACTIVE: { color: "text-red-600", bg: "bg-red-50", label: "Inactive" },
  };

  const status = statusConfig[admin.status] || statusConfig.ACTIVE;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
            <Eye className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Profile</h2>
            <p className="text-sm text-gray-500">View administrator details</p>
          </div>
        </div>
      }
      width="sm:max-w-2xl"
    >
      <div className="space-y-5">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200/50">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center shadow-md border-2 border-white">
                {admin.avatar_url ? (
                  <img
                    src={admin.avatar_url}
                    alt={admin.display_name}
                    className="w-full h-full object-cover rounded-[11px]"
                  />
                ) : (
                  <User className="w-10 h-10 text-blue-600" />
                )}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 ${status.bg} ${status.color} px-2.5 py-0.5 rounded-full text-xs font-bold border-2 border-white shadow-sm`}
              >
                {status.label}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {admin.display_name}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                <Mail size={14} />
                <span>{admin.email}</span>
              </div>

              {/* Enabled Badge */}
              {admin.enabled ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  <CheckCircle size={14} />
                  Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                  <XCircle size={14} />
                  Disabled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
            <Shield size={16} className="text-blue-600" />
            Roles & Permissions
          </h4>
          <div className="flex flex-wrap gap-2">
            {admin.roles?.length > 0 ? (
              admin.roles.map((role) => (
                <div
                  key={role.code}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-300 hover:bg-blue-200 transition-colors"
                >
                  <Shield size={13} />
                  <span>{role.description}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No roles assigned</p>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
            <Calendar size={16} className="text-blue-600" />
            Activity Timeline
          </h4>
          <div className="space-y-3">
            <InfoRow
              icon={Calendar}
              label="Account Created"
              value={formatISODate(admin.created_at)}
            />
            <InfoRow
              icon={Clock}
              label="Last Updated"
              value={formatISODate(admin.updated_at)}
            />
            <InfoRow
              icon={CheckCircle}
              label="Last Login"
              value={formatISODate(admin.last_login_at)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 p-5 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                Status
              </span>
              <CheckCircle size={16} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {admin.status}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 p-5 rounded-xl hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                Total Roles
              </span>
              <Shield size={16} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {admin.roles?.length || 0}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="p-2 bg-white rounded-lg border border-gray-200 flex-shrink-0">
      <Icon size={14} className="text-gray-600" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-900 truncate">
        {value}
      </div>
    </div>
  </div>
);

export default AdminViewModal;

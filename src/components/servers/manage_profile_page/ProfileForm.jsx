import { useState, useEffect } from "react";
import { UserRound, Loader2, Upload, X, Edit2, Save } from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";

const ProfileForm = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    display_name: "",
    avatar_url: "",
    old_password: "",
    new_password: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        display_name: userData.display_name || "",
        avatar_url: userData.avatar_url || "",
        old_password: "",
        new_password: "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        avatar_url: reader.result,
      }));
      setUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar_url: null }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onUpdate({
        display_name: formData.display_name,
        avatar_url: formData.avatar_url || undefined,
        old_password: formData.old_password || undefined,
        new_password: formData.new_password || undefined,
      });

      setIsEditing(false);
      setFormData((prev) => ({ ...prev, old_password: "", new_password: "" }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 md:px-8 py-4 md:py-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Profile Information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account details and preferences
          </p>
        </div>

        <div className="p-4 md:p-8">
          {/* Avatar Section */}
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200">
            <div className="relative flex-shrink-0 mx-auto md:mx-0">
              {uploadLoading ? (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-blue-400" />
                </div>
              ) : formData.avatar_url ? (
                <div className="relative group">
                  <img
                    src={formData.avatar_url}
                    alt="Avatar"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border-2 border-blue-200 shadow-sm"
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-blue-50 flex items-center justify-center border border-dashed border-blue-200">
                  <UserRound className="w-12 h-12 md:w-14 md:h-14 text-blue-300" />
                </div>
              )}

              {isEditing && (
                <label className="mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* User Info Cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-sm md:text-base text-gray-900 font-medium break-all">
                  {userData?.email || "user@example.com"}
                </p>
              </div>
              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </p>
                <p className="text-sm md:text-base text-gray-900 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {userData?.status || "Active"}
                  </span>
                </p>
              </div>
              {/* Last login */}
              <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Last Login
                </p>
                <p className="text-sm md:text-base text-gray-900 font-medium">
                  {formatISODate(userData?.last_login_at || new Date())}
                </p>
              </div>
              {/* Roles */}
              <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Roles
                </p>
                <p className="text-sm md:text-base text-gray-900 font-medium">
                  {userData?.roles?.map((r) => r.code).join(", ") || "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5 md:space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                name="display_name"
                disabled={!isEditing}
                value={formData.display_name}
                onChange={handleChange}
                className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border transition-all text-sm md:text-base ${
                  !isEditing
                    ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-500"
                    : "bg-white border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                }`}
                placeholder="Enter your display name"
              />
            </div>

            {/* Password fields */}
            {isEditing && (
              <div className="space-y-5 md:space-y-6 pt-5 md:pt-6 border-t border-gray-200">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">
                  Change Password
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm md:text-base"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm md:text-base"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm text-sm md:text-base"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData((prev) => ({
                        ...prev,
                        old_password: "",
                        new_password: "",
                      }));
                    }}
                    className="flex-1 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors border border-gray-300 text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;

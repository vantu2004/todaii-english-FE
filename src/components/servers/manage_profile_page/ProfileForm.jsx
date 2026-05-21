import { useState, useEffect } from "react";
import { UserRound, Loader2, Upload, X, Edit2, Save } from "lucide-react";
import { formatISODate } from "@/utils/FormatDate";

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
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 md:px-8 py-5 md:py-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Profile Information
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account details and preferences
          </p>
        </div>

        <div className="px-6 md:px-8 py-6 md:py-8">
          {/* Avatar Section */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="relative flex-shrink-0">
              {uploadLoading ? (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-gray-400" />
                </div>
              ) : formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt="Avatar"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <UserRound className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                </div>
              )}

              {isEditing && (
                <label className="mt-3 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg cursor-pointer transition-colors text-xs font-medium">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* User Info — Flat Rows */}
            <div className="flex-1 min-w-0">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between py-2.5 first:pt-0">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm text-gray-900 font-medium truncate ml-4">
                    {userData?.email || "user@example.com"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="text-sm text-gray-900 font-medium inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {userData?.status || "Active"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-gray-500">Last Login</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {formatISODate(userData?.last_login_at || new Date())}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 last:pb-0">
                  <span className="text-sm text-gray-500">Roles</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {userData?.roles?.map((r) => r.code).join(", ") || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                name="display_name"
                disabled={!isEditing}
                value={formData.display_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border transition-all text-sm ${
                  !isEditing
                    ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-500"
                    : "bg-white border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none"
                }`}
                placeholder="Enter your display name"
              />
            </div>

            {/* Password fields */}
            {isEditing && (
              <div className="space-y-5 pt-5 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">
                  Change Password
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all text-sm"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all text-sm"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors text-sm"
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
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

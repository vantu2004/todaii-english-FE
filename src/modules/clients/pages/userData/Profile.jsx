import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  Camera,
  Edit2,
  Save,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { useClientAuthContext } from "../../../../hooks/clients/useClientAuthContext";

const Profile = () => {
  const { authUser } = useClientAuthContext();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    display_name: "",
    avatar_url: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);

  useEffect(() => {
    if (authUser) setLoading(false);
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "avatar_url") {
      setPreviewAvatar(value);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        "http://localhost:5173/api/authUser/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedauthUser = await response.json();
        setauthUser(updatedauthUser);
        setIsEditing(false);
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      } else {
        setMessage({ type: "error", text: "Không thể cập nhật thông tin" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Đã xảy ra lỗi khi cập nhật" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      display_name: authUser.display_name || "",
      avatar_url: authUser.avatar_url || "",
    });
    setPreviewAvatar(authUser.avatar_url);
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 border-2 border-green-200 text-green-800"
                : "bg-red-50 border-2 border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center overflow-hidden">
                  {previewAvatar ? (
                    <img
                      src={previewAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<User class="w-16 h-16 text-white" />`;
                      }}
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            {/* Edit Button */}
            <div className="flex justify-end mb-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Lưu
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Editable Fields */}
            <div className="space-y-6 mb-8">
              {/* Display Name */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <User className="w-4 h-4 text-blue-600" />
                  Tên hiển thị
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors text-gray-900 font-medium"
                    placeholder="Nhập tên hiển thị..."
                  />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {authUser.display_name || "Chưa đặt tên"}
                  </p>
                )}
              </div>

              {/* Avatar URL */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Camera className="w-4 h-4 text-purple-600" />
                  URL Avatar
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none transition-colors text-gray-900"
                    placeholder="https://example.com/avatar.jpg"
                  />
                ) : (
                  <p className="text-gray-900 font-medium break-all">
                    {authUser.avatar_url || "Chưa có avatar"}
                  </p>
                )}
              </div>
            </div>

            {/* Read-only Information */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
                <p className="text-gray-900 font-semibold">{authUser.email}</p>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Shield className="w-4 h-4" />
                  Trạng thái
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      authUser.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {authUser.status === "ACTIVE"
                      ? "Hoạt động"
                      : "Không hoạt động"}
                  </span>
                  {authUser.enabled && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>

              {/* Email Verified */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Check className="w-4 h-4" />
                  Email đã xác thực
                </div>
                <p className="text-gray-900 font-medium">
                  {authUser.email_verified_at
                    ? formatDate(authUser.email_verified_at)
                    : "Chưa xác thực"}
                </p>
              </div>

              {/* Last Login */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  Đăng nhập lần cuối
                </div>
                <p className="text-gray-900 font-medium">
                  {formatDate(authUser.last_login_at)}
                </p>
              </div>

              {/* Created At */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  Tham gia
                </div>
                <p className="text-gray-900 font-medium">
                  {formatDate(authUser.created_at)}
                </p>
              </div>

              {/* Updated At */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  Cập nhật lần cuối
                </div>
                <p className="text-gray-900 font-medium">
                  {formatDate(authUser.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Bảo mật tài khoản
              </h3>
              <p className="text-sm text-gray-600">
                ID tài khoản:{" "}
                <span className="font-mono font-semibold">#{authUser.id}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Để thay đổi mật khẩu hoặc cài đặt bảo mật, vui lòng liên hệ quản
                trị viên.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

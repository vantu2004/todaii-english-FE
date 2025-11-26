import React, { useState, useEffect, useRef } from "react";
import { Save, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { formatISODate } from "../../../utils/FormatDate";
import { logError } from "../../../utils/LogError";
import { useClientAuthContext } from "../../../hooks/clients/useClientAuthContext";
import { updateProfile } from "../../../api/clients/userApi";
import InfoRow from "../../../components/clients/profile_page/InfoRow";
import AvatarSection from "../../../components/clients/profile_page/AvatarSection";
import GeneralInfoSection from "../../../components/clients/profile_page/GeneralInfoSection";
import PasswordSection from "../../../components/clients/profile_page/PasswordSection";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const { authUser, setAuthUser } = useClientAuthContext();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    display_name: "",
    avatar_url: "",
    old_password: "",
    new_password: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      setFormData({
        display_name: authUser.display_name || "",
        avatar_url: authUser.avatar_url || "",
        old_password: "",
        new_password: "",
      });

      setPreviewAvatar(authUser.avatar_url || "");
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds the limit of 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setPreviewAvatar(base64);
      setFormData((prev) => ({ ...prev, avatar_url: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleRemoveImage = () => {
    setPreviewAvatar("");
    setFormData((prev) => ({ ...prev, avatar_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const updated = await updateProfile(formData);
      setAuthUser(updated);

      toast.success("Update profile successfully!");
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="dictionary-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-neutral-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <div className="mb-8">
            <h1 className="text-3xl font-light text-neutral-900 tracking-tight">
              Hồ sơ cá nhân
            </h1>
            <p className="mt-2 text-neutral-500 text-sm">
              Quản lý thông tin cá nhân và bảo mật tài khoản của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8 sticky top-24">
                <AvatarSection
                  authUser={authUser}
                  previewAvatar={previewAvatar}
                  triggerFileInput={triggerFileInput}
                  handleRemoveImage={handleRemoveImage}
                />

                <div className="my-6 border-t border-neutral-100" />

                <div className="space-y-4">
                  <InfoRow
                    icon={<Calendar size={16} />}
                    label="Ngày tham gia"
                    value={formatISODate(authUser.created_at)}
                  />
                  <InfoRow
                    icon={<Clock size={16} />}
                    label="Đăng nhập cuối"
                    value={formatISODate(authUser.last_login_at)}
                  />
                  <InfoRow
                    icon={<Clock size={16} />}
                    label="Cập nhật cuối"
                    value={formatISODate(authUser.updated_at)}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit}>
                <GeneralInfoSection
                  formData={formData}
                  handleChange={handleChange}
                  previewAvatar={previewAvatar}
                  triggerFileInput={triggerFileInput}
                  handleRemoveImage={handleRemoveImage}
                />

                <PasswordSection
                  formData={formData}
                  handleChange={handleChange}
                />

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        display_name: authUser.display_name || "",
                        avatar_url: authUser.avatar_url || "",
                        old_password: "",
                        new_password: "",
                      });
                      setPreviewAvatar(authUser.avatar_url || "");
                    }}
                    className="px-6 py-3 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-neutral-900 text-white text-sm font-bold shadow-lg hover:bg-neutral-800 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Profile;

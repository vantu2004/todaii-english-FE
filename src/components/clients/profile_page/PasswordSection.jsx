import { Lock } from "lucide-react";

const PasswordSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-white dark:bg-neutral-900/60 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-700 dark:text-neutral-300">
          <Lock size={20} />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
          Đổi mật khẩu
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            autoComplete="new-password"
            className="w-full px-4 py-3 bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:placeholder:text-neutral-500 transition-all"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Mật khẩu mới
          </label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 dark:placeholder:text-neutral-500 transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
        Để trống nếu bạn không muốn đổi mật khẩu.
      </p>
    </div>
  );
};

export default PasswordSection;

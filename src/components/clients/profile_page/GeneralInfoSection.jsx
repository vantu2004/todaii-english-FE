import { User, Upload, X } from "lucide-react";

const GeneralInfoSection = ({
  formData,
  handleChange,
  previewAvatar,
  triggerFileInput,
  handleRemoveImage,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 sm:p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-neutral-100 rounded-xl text-neutral-700">
          <User size={20} />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">Thông tin chung</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Tên hiển thị <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            required
            minLength={1}
            maxLength={191}
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-500 focus:ring-4 focus:ring-neutral-50 transition-all"
            placeholder="Nhập tên hiển thị của bạn"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Ảnh đại diện
          </label>

          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100 border-dashed">
            <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0 border border-neutral-200">
              {previewAvatar ? (
                <img
                  src={previewAvatar}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <User size={20} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Upload size={16} />
                Tải ảnh lên
              </button>

              {previewAvatar && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-neutral-400 mt-1">
            Hỗ trợ định dạng: JPG, PNG. Dung lượng tối đa: 2MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoSection;

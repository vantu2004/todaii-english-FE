import { User, Camera, AlertCircle, CheckCircle2, Shield } from "lucide-react";

const AvatarSection = ({
  authUser,
  previewAvatar,
  triggerFileInput,
  handleRemoveImage,
}) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="relative group cursor-pointer"
        onClick={triggerFileInput}
        title="Nhấn để thay đổi ảnh đại diện"
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-neutral-100 relative">
          {previewAvatar ? (
            <img
              src={previewAvatar}
              alt="Avatar"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.src =
                  "https://ui-avatars.com/api/?name=User&background=random";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50">
              <User size={64} />
            </div>
          )}

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
            <Camera size={32} />
          </div>
        </div>

        <div
          className={`absolute bottom-2 right-2 w-6 h-6 border-4 border-white rounded-full ${
            authUser.enabled ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
      </div>

      <h2 className="mt-4 text-xl font-bold text-neutral-900">
        {authUser.display_name}
      </h2>
      <p className="text-sm text-neutral-500 font-medium break-all">
        {authUser.email}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {authUser.status === "ACTIVE" && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 size={12} /> Active
          </span>
        )}
        {authUser.emailVerifiedAt ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            <Shield size={12} /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            <AlertCircle size={12} /> Unverified
          </span>
        )}
      </div>
    </div>
  );
};

export default AvatarSection;

import React from "react";
import { X, Trash2, History } from "lucide-react";
import ProviderSwitcher from "./ProviderSwitcher";

const ChatHeader = ({
  onClose,
  onClear,
  aiProvider,
  setAiProvider,
  isMobile,
  onLoadHistory,
  isHistoryLoading,
  hasMoreHistory,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white text-zinc-950 border-b border-zinc-100 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        {/* Logo mark - Warm Zinc "T" instead of Snowflake/AI particles */}
        <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm select-none">
          T
        </div>
        <div>
          <h3 className="text-[13.5px] font-bold tracking-tight text-zinc-900 leading-none">
            Todaii AI
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <ProviderSwitcher provider={aiProvider} setProvider={setAiProvider} />

        <button
          onClick={onLoadHistory}
          disabled={isHistoryLoading || !hasMoreHistory}
          title={
            !hasMoreHistory ? "Đã tải hết lịch sử" : "Xem lịch sử trò chuyện"
          }
          className="p-1.5 rounded-lg bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 border border-zinc-200/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Xem lịch sử"
        >
          <History
            size={14}
            className={isHistoryLoading ? "animate-spin" : ""}
          />
        </button>

        <button
          onClick={onClear}
          title="Xóa cuộc hội thoại"
          className="p-1.5 rounded-lg bg-zinc-50 text-zinc-500 hover:bg-red-50 hover:text-red-600 border border-zinc-200/50 transition-colors"
          aria-label="Xóa cuộc hội thoại"
        >
          <Trash2 size={14} />
        </button>

        <button
          onClick={onClose}
          title="Đóng"
          className="p-1.5 rounded-lg bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-850 border border-zinc-200/50 transition-colors ml-0.5"
          aria-label="Đóng"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

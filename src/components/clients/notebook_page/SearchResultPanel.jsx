import { Plus, Sparkles, Loader2, Search, AlertTriangle } from "lucide-react";

import TodaiiDictResult from "@/components/clients/dictionary_page/TodaiiDictResult";
import FreeDictResult from "@/components/clients/dictionary_page/FreeDictResult";
import NotFoundState from "@/components/clients/dictionary_page/NotFoundState";

const SearchResultPanel = ({ state, onAdd, onWordClick }) => {
  if (state.isSearching)
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-in fade-in duration-200">
        <Loader2
          className="animate-spin text-neutral-450 mb-2 dark:text-neutral-500"
          size={32}
        />
        <p className="text-sm text-neutral-400 animate-pulse dark:text-neutral-500">
          Đang tìm kiếm...
        </p>
      </div>
    );

  if (state.error === "NOT_FOUND")
    return <NotFoundState word={state.term} onSuggestionClick={onWordClick} />;

  if (state.error === "SERVER_ERROR")
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-neutral-900/60 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
          Đã xảy ra lỗi kết nối
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          Không thể kết nối đến máy chủ từ điển. Vui lòng kiểm tra lại đường
          truyền mạng và thử lại sau.
        </p>
      </div>
    );

  if (state.error)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-red-50/50 rounded-lg border border-red-100 dark:bg-red-900/20 dark:border-red-800 animate-in fade-in duration-200">
        <p className="text-red-600 font-semibold mb-1 dark:text-red-400 text-sm sm:text-base">
          Không tìm thấy từ vựng
        </p>
        <p className="text-xs text-red-400 dark:text-red-500">{state.error}</p>
      </div>
    );

  if (!state.result.length)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-300 select-none dark:text-neutral-600 animate-in fade-in duration-200">
        <Search size={48} className="mb-4 opacity-20" />
        <p className="text-sm">Nhập từ vựng để xem chi tiết kết quả tra cứu</p>
      </div>
    );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-neutral-900 text-white p-4 rounded-lg shadow-md dark:bg-neutral-850">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-neutral-350 uppercase tracking-wider dark:text-neutral-400">
              Kết quả tra cứu cho
            </p>
            <p className="text-sm font-bold dark:text-white">"{state.term}"</p>
          </div>
        </div>

        {state.type === "todaii" ? (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-white text-neutral-900 hover:bg-neutral-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm dark:hover:bg-neutral-100"
          >
            <Plus size={16} />
            Lưu vào sổ tay
          </button>
        ) : (
          <span className="text-xs text-neutral-400 bg-neutral-800 dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-700">
            Chỉ hỗ trợ lưu từ Todaii API
          </span>
        )}
      </div>

      {/* Detail View */}
      <div>
        {state.type === "todaii" ? (
          <TodaiiDictResult
            data={{ result: state.result }}
            onWordClick={onWordClick}
          />
        ) : (
          <FreeDictResult data={state.result} onWordClick={onWordClick} />
        )}
      </div>
    </div>
  );
};

export default SearchResultPanel;

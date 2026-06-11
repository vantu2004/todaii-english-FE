import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Send, X } from "lucide-react";

const SubmitConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  answeredCount,
  markedCount,
  unansweredCount,
  isSubmitting,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-neutral-900 rounded-lg w-full max-w-md overflow-hidden pointer-events-auto border border-neutral-200 dark:border-neutral-800"
            >
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Xác nhận nộp bài
                </h2>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Đã hoàn thành
                    </span>
                    <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                      {answeredCount} câu
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-neutral-800">
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-500">
                      Đang đánh dấu
                    </span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-500">
                      {markedCount} câu
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Chưa làm
                    </span>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white">
                      {unansweredCount} câu
                    </span>
                  </div>
                </div>

                {unansweredCount > 0 && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                    <AlertTriangle
                      className="text-red-500 dark:text-red-400 shrink-0 mt-0.5"
                      size={18}
                    />
                    <p className="text-xs text-red-700 dark:text-red-400 font-medium leading-relaxed">
                      Bạn vẫn còn {unansweredCount} câu chưa hoàn thành. Bạn có
                      chắc chắn muốn nộp bài lúc này?
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 text-xs"
                >
                  Tiếp tục làm bài
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? "Đang nộp..." : "Nộp bài ngay"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubmitConfirmDialog;

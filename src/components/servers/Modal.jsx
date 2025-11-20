import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer, // có thể truyền custom footer
  width = "sm:max-w-lg", // tuỳ chỉnh kích thước modal
}) => {
  // Đóng khi nhấn phím Escape
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose} // bấm ra ngoài để đóng
        >
          {/* Modal Box */}
          <motion.div
            className={`relative w-full mx-4 ${width} bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden`}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()} // ngăn đóng khi click bên trong
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-blue-600 transition"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

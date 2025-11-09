import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ header, body, isOpen, onClose, onConfirm }) => {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/50 flex items-end sm:items-center sm:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            onClick={onClose} // close when clicking backdrop
          >
            {/* Modal */}
            <motion.div
              className="fixed z-40 w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg sm:rounded-lg sm:m-4 sm:max-w-xl dark:bg-gray-800"
              initial={{ opacity: 0, y: "50%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "50%" }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()} // prevent closing on modal click
            >

              {/* Body */}
              <div className="mt-4 mb-6">
                <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {header}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  {body}
                </p>
              </div>

              {/* Footer */}
              <footer className="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={onClose}
                  className="cursor-pointer w-full px-5 py-3 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg sm:w-auto sm:px-4 sm:py-2 hover:border-gray-500 focus:border-gray-500 focus:outline-none focus:shadow-outline-gray dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (onConfirm) onConfirm();
                    onClose();
                  }}
                  className="cursor-pointer w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Confirm
                </button>
              </footer>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

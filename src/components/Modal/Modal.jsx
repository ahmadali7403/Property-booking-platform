import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className={`relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-float ${className}`}
          >
            <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {title}
                </h2>
              )}

              <button
                type="button"
                onClick={onClose}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-surface-muted hover:text-gray-900"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

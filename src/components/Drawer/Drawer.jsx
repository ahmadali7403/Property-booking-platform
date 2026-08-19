import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

const Drawer = ({ isOpen, onClose, title, children, className = "" }) => {
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
        <div className="fixed inset-0 z-50">
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
            initial={{
              y: "100%",
              x: 0,
            }}
            animate={{
              y: 0,
              x: 0,
            }}
            exit={{
              y: "100%",
              x: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className={`absolute bottom-0 left-0 w-full rounded-t-2xl bg-white shadow-float md:bottom-0 md:left-auto md:right-0 md:top-0 md:h-full md:w-[420px] md:rounded-none md:rounded-l-2xl ${className}`}
          >
            <div className="flex items-center justify-between border-b border-border-soft px-6 py-4">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              )}

              <button
                type="button"
                onClick={onClose}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-surface-muted hover:text-gray-900"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-6 md:h-[calc(100%-73px)] md:max-h-none">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;

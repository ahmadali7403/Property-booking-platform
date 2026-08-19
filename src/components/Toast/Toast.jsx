import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const Toast = ({ isOpen, onClose, message, type = "success" }) => {
  const variants = {
    success: {
      icon: CheckCircle2,
      iconClass: "text-green-600",
      background: "bg-green-50",
    },

    error: {
      icon: XCircle,
      iconClass: "text-red-600",
      background: "bg-red-50",
    },

    info: {
      icon: Info,
      iconClass: "text-blue-600",
      background: "bg-blue-50",
    },
  };

  const current = variants[type] || variants.success;
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className={`fixed right-4 top-4 z-[60] flex max-w-sm items-center gap-3 rounded-2xl bg-white p-4 shadow-float ${current.background}`}
          role="status"
          aria-live="polite"
        >
          <Icon size={20} className={current.iconClass} />

          <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-black/5 hover:text-gray-900"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

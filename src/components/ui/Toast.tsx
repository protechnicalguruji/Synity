import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      bg: "bg-[#FFFFFF]",
      border: "border-emerald-500/30",
      text: "text-emerald-800",
      icon: <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />,
      shadow: "shadow-[0_8px_30px_rgb(16,185,129,0.08)]",
    },
    error: {
      bg: "bg-[#FFFFFF]",
      border: "border-rose-500/30",
      text: "text-rose-800",
      icon: <AlertCircle size={16} className="text-rose-500 shrink-0" />,
      shadow: "shadow-[0_8px_30px_rgb(244,63,94,0.08)]",
    },
    info: {
      bg: "bg-[#FFFFFF]",
      border: "border-[#8CB9D7]/30",
      text: "text-gray-800",
      icon: <Info size={16} className="text-[#8CB9D7] shrink-0" />,
      shadow: "shadow-[0_8px_30px_rgb(78,78,73,0.08)]",
    },
  };

  const current = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-center gap-3.5 p-4 rounded-xl border ${current.bg} ${current.border} ${current.text} ${current.shadow} max-w-sm w-full font-sans text-xs font-medium pointer-events-auto`}
      id="synity-toast"
    >
      {current.icon}
      <div className="flex-1 leading-relaxed text-[#2F2F2F]">{message}</div>
      <button
        onClick={onClose}
        className="text-[#666666]/60 hover:text-[#2F2F2F] p-0.5 hover:bg-[#E5E3E7]/50 rounded transition-colors"
        aria-label="Close"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => onRemove(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

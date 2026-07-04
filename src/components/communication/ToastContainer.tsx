/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNotifications } from "../../providers/NotificationProvider";
import { CheckCircle, AlertTriangle, AlertCircle, Info, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-3 max-w-sm w-full pointer-events-none" id="global-toast-container">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgClass = "bg-white border-gray-200 text-gray-800";
          let icon = <Info size={16} className="text-blue-500" />;

          switch (toast.type) {
            case "success":
              bgClass = "bg-white border-emerald-200 text-emerald-900";
              icon = <CheckCircle size={16} className="text-emerald-500" />;
              break;
            case "warning":
              bgClass = "bg-white border-amber-200 text-amber-900";
              icon = <AlertTriangle size={16} className="text-amber-500" />;
              break;
            case "error":
              bgClass = "bg-[#FFF5F5] border-rose-200 text-rose-900";
              icon = <AlertCircle size={16} className="text-rose-500 animate-pulse" />;
              break;
            case "ai":
              bgClass = "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-950";
              icon = <Sparkles size={16} className="text-purple-600 animate-bounce" />;
              break;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-xl border shadow-md flex items-start gap-3 pointer-events-auto text-left ${bgClass}`}
              role="alert"
            >
              <div className="shrink-0 mt-0.5">{icon}</div>
              <div className="flex-1 space-y-0.5">
                <h4 className="text-xs font-bold font-sans">{toast.title}</h4>
                <p className="text-[11px] font-medium leading-relaxed opacity-90">{toast.description}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors p-0.5"
                aria-label="Dismiss toast"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
export default ToastContainer;

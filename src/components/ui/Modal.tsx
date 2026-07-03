/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../../utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
}) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#4E4E49]/35 backdrop-blur-sm"
          />

          {/* Modal content container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={cn(
              "relative w-full bg-white border border-[#D8D8D8] rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col my-8",
              sizes[size]
            )}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#D8D8D8] flex items-center justify-between">
              {title ? (
                <h3 className="text-lg font-semibold text-[#2F2F2F] tracking-tight font-display">
                  {title}
                </h3>
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#E5E3E7]/50 text-[#666666] hover:text-[#2F2F2F] transition-all cursor-pointer outline-none focus:ring-2 focus:ring-primary-accent"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content body */}
            <div className="px-6 py-5 overflow-y-auto max-h-[calc(100vh-12rem)] text-sm">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

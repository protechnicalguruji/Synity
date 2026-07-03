/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { cn } from "../../utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "neutral",
  size = "md",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full tracking-wide";
  
  const variants = {
    primary: "bg-[#E5E3E7] text-[#4E4E49] border border-[#D8D8D8]",
    secondary: "bg-[#60605B]/10 text-[#60605B]",
    accent: "bg-[#8CB9D7]/15 text-[#3b7194] border border-[#8CB9D7]/30",
    success: "bg-[#E2F7EB] text-[#1B7C43] border border-emerald-200/50",
    warning: "bg-[#FDF4E2] text-[#B77C13] border border-amber-200/50",
    danger: "bg-red-50 text-red-700 border border-red-200/50",
    neutral: "bg-gray-100 text-gray-700 border border-gray-200/80"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs"
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};

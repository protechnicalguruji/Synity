/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { cn } from "../../utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "ghost" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-[#4E4E49] hover:bg-[#60605B] text-white shadow-sm border border-[#4E4E49]",
    secondary: "bg-[#60605B] hover:bg-[#4E4E49] text-white shadow-sm border border-[#60605B]",
    accent: "bg-[#8CB9D7] hover:bg-[#7ba9c7] text-white shadow-sm border border-[#8CB9D7]",
    outline: "bg-transparent border border-[#D8D8D8] text-[#2F2F2F] hover:bg-[#E5E3E7]/50",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm border border-red-600",
    ghost: "bg-transparent text-[#2F2F2F] hover:bg-[#E5E3E7]/50 hover:text-[#2F2F2F]"
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3.5 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.985 }}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...(props as any)}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {!isLoading && icon && iconPosition === "left" && (
        <span className="mr-2 inline-flex items-center justify-center">{icon}</span>
      )}
      
      <span>{children}</span>
      
      {!isLoading && icon && iconPosition === "right" && (
        <span className="ml-2 inline-flex items-center justify-center">{icon}</span>
      )}
    </motion.button>
  );
};

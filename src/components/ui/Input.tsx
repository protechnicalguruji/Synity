/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef } from "react";
import { cn } from "../../utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, icon, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-[#2F2F2F] tracking-tight">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-2xs">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            id={id}
            type={type}
            className={cn(
              "block w-full rounded-lg border border-[#D8D8D8] bg-white text-[#2F2F2F] placeholder-[#666666]/60 text-sm transition-all duration-200 focus:border-[#4E4E49] focus:ring-1 focus:ring-[#4E4E49] outline-none py-2.5",
              icon ? "pl-10 pr-4" : "px-4",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#D8D8D8]",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-[#666666]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-[#2F2F2F] tracking-tight">
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            "block w-full rounded-lg border border-[#D8D8D8] bg-white text-[#2F2F2F] placeholder-[#666666]/60 text-sm transition-all duration-200 focus:border-[#4E4E49] focus:ring-1 focus:ring-[#4E4E49] outline-none px-4 py-2.5 min-h-[100px] resize-y",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#D8D8D8]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-[#666666]">{helperText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-[#2F2F2F] tracking-tight">
            {label}
          </label>
        )}
        <select
          id={id}
          className={cn(
            "block w-full rounded-lg border border-[#D8D8D8] bg-white text-[#2F2F2F] text-sm transition-all duration-200 focus:border-[#4E4E49] focus:ring-1 focus:ring-[#4E4E49] outline-none px-4 py-2.5 appearance-none",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#D8D8D8]",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-[#666666]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

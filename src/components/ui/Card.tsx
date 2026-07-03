/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { cn } from "../../utils";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  description,
  headerActions,
  footer,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-white border border-[#D8D8D8] rounded-xl shadow-xs overflow-hidden transition-all duration-200",
        hoverable && "hover:border-[#60605B] hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      {(title || description || headerActions) && (
        <div className="px-6 py-5 border-b border-[#D8D8D8] flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h3 className="text-base font-semibold text-[#2F2F2F] tracking-tight font-display">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-[#666666] leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}
      
      <div className="px-6 py-5 text-sm text-[#2F2F2F]">{children}</div>
      
      {footer && (
        <div className="px-6 py-4 bg-[#E5E3E7]/20 border-t border-[#D8D8D8] flex items-center justify-between gap-4">
          {footer}
        </div>
      )}
    </div>
  );
};

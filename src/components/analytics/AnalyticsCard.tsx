/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface AnalyticsCardProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  description,
  className = "",
  children,
  headerAction
}) => {
  return (
    <div
      className={`bg-white border border-[#D8D8D8] rounded-2xl p-5 text-left flex flex-col space-y-4 shadow-3xs transition-all hover:border-purple-300 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <h3 className="text-xs font-extrabold text-[#2F2F2F] tracking-tight uppercase font-sans">
            {title}
          </h3>
          {description && (
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>
      <div className="flex-1 min-h-0 w-full">{children}</div>
    </div>
  );
};

export default AnalyticsCard;

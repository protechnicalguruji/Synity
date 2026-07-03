/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { cn } from "../../utils";

export const Spinner: React.FC<{ className?: string; size?: "sm" | "md" | "lg" }> = ({
  className,
  size = "md",
}) => {
  const sizes = {
    sm: "h-4 w-4 stroke-2",
    md: "h-8 w-8 stroke-[1.5]",
    lg: "h-12 w-12 stroke-[1.5]",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        className={cn("animate-spin text-[#4E4E49]", sizes[size])}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-85"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#E5E3E7]/50", className)}
      {...props}
    />
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between pb-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <div className="border border-[#D8D8D8] rounded-xl overflow-hidden bg-white">
        <div className="bg-gray-50 px-6 py-4 border-b border-[#D8D8D8]">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
        </div>
        <div className="divide-y divide-[#D8D8D8]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-5">
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[90px]" />
                <Skeleton className="h-4 w-[110px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BoardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
      {[1, 2, 3, 4, 5].map((col) => (
        <div key={col} className="bg-[#E5E3E7]/20 border border-[#D8D8D8] p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-[80px]" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((card) => (
              <div key={card} className="bg-white border border-[#D8D8D8] p-4 rounded-lg space-y-3">
                <Skeleton className="h-4 w-[130px]" />
                <Skeleton className="h-3 w-[180px]" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-[50px] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

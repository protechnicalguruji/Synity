/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-[#D8D8D8] rounded-xl bg-white/40">
      <div className="p-3.5 rounded-full bg-[#E5E3E7]/50 text-[#60605B] mb-4">
        {icon || <FolderOpen size={24} />}
      </div>
      <h3 className="text-base font-semibold text-[#2F2F2F] tracking-tight font-display mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-[#666666] max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

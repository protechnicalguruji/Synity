import React from "react";
import { LeadStatus } from "../../types";
import { getStatusStyle } from "../../utils";

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status, className }) => {
  const style = getStatusStyle(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text} border border-black/5 ${className || ""}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 opacity-80" style={{ backgroundColor: "currentColor" }}></span>
      {style.label}
    </span>
  );
};

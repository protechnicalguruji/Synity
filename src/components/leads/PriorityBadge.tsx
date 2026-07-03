import React from "react";

interface PriorityBadgeProps {
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const getStyles = () => {
    switch (priority) {
      case "URGENT":
        return "bg-red-50 text-red-700 border-red-200/60";
      case "HIGH":
        return "bg-orange-50 text-orange-700 border-orange-200/60";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "LOW":
        return "bg-gray-50 text-gray-600 border-gray-200/60";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200/60";
    }
  };

  const label = priority ? priority.charAt(0) + priority.slice(1).toLowerCase() : "Low";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getStyles()} ${className || ""}`}
    >
      {label}
    </span>
  );
};

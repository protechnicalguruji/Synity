/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  accentColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  className = "",
  accentColor = "#4E4E49" // Default deep charcoal brand color
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} id="synity-progress-ring-container">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          className="text-[#E5E3E7]/50"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Foreground Progress Circle */}
        <circle
          className="transition-all duration-700 ease-out"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Inner Text Overlay */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold font-display text-[#2F2F2F] tracking-tight">{percentage}%</span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Progress</span>
      </div>
    </div>
  );
};

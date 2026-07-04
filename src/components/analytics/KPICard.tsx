/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconBg: string;
  id?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  trend,
  icon,
  iconBg,
  id
}) => {
  return (
    <div
      id={id}
      className="bg-white border border-[#D8D8D8] rounded-2xl p-4 flex items-center justify-between shadow-3xs transition-all hover:border-purple-300 text-left"
    >
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl shrink-0 flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            {label}
          </span>
          <span className="text-xl font-bold font-display text-[#2F2F2F] tracking-tight block">
            {value}
          </span>
        </div>
      </div>

      {trend && (
        <div
          className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            trend.isPositive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-rose-50 text-rose-700 border border-rose-100"
          }`}
        >
          {trend.isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          <span>{trend.isPositive ? "+" : "-"}{trend.value}%</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;

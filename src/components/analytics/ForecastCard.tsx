/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { RevenueForecast } from "../../types/analytics";
import { formatCurrency } from "../../utils";
import { Sparkles, HelpCircle, ArrowRight, TrendingUp } from "lucide-react";

interface ForecastCardProps {
  forecast: RevenueForecast;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const models = [
    {
      name: "Optimistic Range",
      value: forecast.optimistic,
      desc: "All active deals close-out successfully",
      color: "border-emerald-200 bg-emerald-50/30 text-emerald-800"
    },
    {
      name: "Expected Weighted",
      value: forecast.expected,
      desc: "Confidence score adjusted prediction",
      color: "border-blue-200 bg-blue-50/30 text-blue-800"
    },
    {
      name: "Most Likely Outturn",
      value: forecast.likely,
      desc: "Standard historical phase conversion",
      color: "border-purple-200 bg-purple-50/30 text-purple-800"
    },
    {
      name: "Pessimistic Floor",
      value: forecast.pessimistic,
      desc: "Minimum projected contract realization",
      color: "border-amber-200 bg-amber-50/30 text-amber-800"
    }
  ];

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600 animate-pulse" />
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            AI Sales Revenue Forecaster
          </h3>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          PROJECTION MODEL v1.0
        </span>
      </div>

      <div className="space-y-3">
        {models.map((m) => (
          <div
            key={m.name}
            className={`border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:translate-x-1 transition-transform ${m.color}`}
          >
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold uppercase tracking-tight">
                {m.name}
              </span>
              <p className="text-[10px] opacity-80 font-medium">
                {m.desc}
              </p>
            </div>
            <div className="font-mono text-base font-black tracking-tight shrink-0">
              {formatCurrency(m.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-start gap-2.5 text-[10px] text-gray-500 font-medium">
        <HelpCircle size={14} className="text-gray-400 shrink-0 mt-0.5" />
        <p className="leading-normal">
          Forecasting engine operates utilizing continuous probability weightings assigned to live opportunities in the pipeline stages. Relies on daily rolling estimates.
        </p>
      </div>
    </div>
  );
};

export default ForecastCard;

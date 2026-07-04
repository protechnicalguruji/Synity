/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Clock, Check, X } from "lucide-react";

interface SnoozeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
  notificationTitle?: string;
}

export const SnoozeDialog: React.FC<SnoozeDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  notificationTitle
}) => {
  const [customValue, setCustomValue] = useState("");
  const [customUnit, setCustomUnit] = useState<"MINUTES" | "HOURS" | "DAYS">("MINUTES");

  if (!isOpen) return null;

  const presets = [
    { label: "10 Minutes", minutes: 10 },
    { label: "30 Minutes", minutes: 30 },
    { label: "1 Hour", minutes: 60 },
    { label: "3 Hours", minutes: 180 },
    { label: "Tomorrow Morning", minutes: 1440 }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customValue, 10);
    if (isNaN(val) || val <= 0) return;

    let multiplier = 1;
    if (customUnit === "HOURS") multiplier = 60;
    if (customUnit === "DAYS") multiplier = 1440;

    onConfirm(val * multiplier);
    setCustomValue("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs" id="snooze-dialog-overlay">
      <div className="bg-white border border-[#D8D8D8] rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-left animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5 text-purple-700 font-bold text-sm">
            <Clock size={16} />
            <span>Snooze Action Alert</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {notificationTitle && (
          <div className="bg-[#FAF9FC] border border-[#EBEBEB] p-2.5 rounded-xl">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Item being deferred</p>
            <p className="text-xs font-semibold text-[#2F2F2F] truncate mt-0.5">{notificationTitle}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">Snooze Presets</label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  onConfirm(preset.minutes);
                  onClose();
                }}
                className="px-3 py-2 text-xs font-semibold text-[#2F2F2F] bg-[#FAF9FC] border border-[#D8D8D8] hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 rounded-xl transition-all cursor-pointer text-left flex items-center justify-between"
              >
                <span>{preset.label}</span>
                <Clock size={11} className="opacity-40" />
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-2 border-t border-[#EBEBEB] pt-4">
          <label className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block">Custom Duration</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="E.g., 45"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              className="w-20 text-xs border border-[#D8D8D8] rounded-xl px-2.5 py-2 focus:outline-none focus:border-purple-500 font-medium"
              min="1"
              required
            />
            <select
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value as any)}
              className="text-xs border border-[#D8D8D8] rounded-xl px-2 py-2 bg-white focus:outline-none focus:border-purple-500 font-semibold"
            >
              <option value="MINUTES">Minutes</option>
              <option value="HOURS">Hours</option>
              <option value="DAYS">Days</option>
            </select>
            <button
              type="submit"
              className="p-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer flex-1"
            >
              <Check size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SnoozeDialog;

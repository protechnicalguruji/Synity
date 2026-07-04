/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SmartReminder } from "../../types/communication";
import { Clock, Plus, Trash2, CheckCircle, Bell, Sparkles } from "lucide-react";

interface ReminderCardProps {
  reminders: SmartReminder[];
  onAddReminder: (type: "REPLY_IN_2H" | "CALL_TOMORROW" | "FOLLOW_UP_FRIDAY" | "CUSTOM", title: string) => void;
  onRemoveReminder: (id: string) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminders,
  onAddReminder,
  onRemoveReminder
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [selectedType, setSelectedType] = useState<"REPLY_IN_2H" | "CALL_TOMORROW" | "FOLLOW_UP_FRIDAY" | "CUSTOM">("REPLY_IN_2H");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddReminder(selectedType, newTitle);
    setNewTitle("");
  };

  const getRapidDetails = (type: string) => {
    switch (type) {
      case "REPLY_IN_2H":
        return { label: "Reply in 2 hours", titleDefault: "Follow up on previous thread" };
      case "CALL_TOMORROW":
        return { label: "Call Tomorrow", titleDefault: "Check in via direct phone call" };
      case "FOLLOW_UP_FRIDAY":
        return { label: "Follow Up Friday", titleDefault: "Send weekly progress review note" };
      default:
        return { label: "Custom Reminder", titleDefault: "Follow up with client" };
    }
  };

  const handleSelectTypeChange = (type: "REPLY_IN_2H" | "CALL_TOMORROW" | "FOLLOW_UP_FRIDAY" | "CUSTOM") => {
    setSelectedType(type);
    const details = getRapidDetails(type);
    setNewTitle(details.titleDefault);
  };

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-xl p-4 text-left space-y-4 shadow-2xs" id="reminder-card-root">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-[#D8D8D8] pb-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F2F2F] flex items-center gap-1.5">
          <Bell size={13} className="text-purple-600 animate-swing" />
          Smart Response Reminders
        </h4>
        <span className="text-[10px] font-mono font-bold bg-[#E5E3E7] text-[#2F2F2F] px-1.5 py-0.5 rounded-full">
          {reminders.length} Active
        </span>
      </div>

      {/* Reminder List */}
      {reminders.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-2 text-center">
          No reminders scheduled. Use quick triggers below to set standard SLA alerts.
        </p>
      ) : (
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {reminders.map((rem) => {
            const timeStr = new Date(rem.dueDate).toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });
            return (
              <div 
                key={rem.id}
                className="flex items-start justify-between p-2 rounded-lg border border-[#E5E3E7] bg-[#F8F7FA] text-xs hover:border-purple-300 transition-all group"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <p className="font-semibold text-gray-700 truncate">{rem.title}</p>
                  <p className="text-[10px] text-purple-600 font-mono font-bold flex items-center gap-1">
                    <Clock size={10} /> {timeStr}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveReminder(rem.id)}
                  className="text-gray-400 hover:text-purple-600 p-1 rounded-md hover:bg-gray-200 transition-all cursor-pointer group-hover:scale-105"
                  title="Complete or delete reminder"
                >
                  <CheckCircle size={14} className="hover:fill-purple-50" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Setter Form */}
      <div className="border-t border-gray-100 pt-3 space-y-2.5">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
          Schedule Rapid SLA Trigger
        </span>
        
        {/* Preset rapid pills */}
        <div className="flex flex-wrap gap-1.5">
          {(["REPLY_IN_2H", "CALL_TOMORROW", "FOLLOW_UP_FRIDAY", "CUSTOM"] as const).map((type) => {
            const isSelected = selectedType === type;
            const details = getRapidDetails(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectTypeChange(type)}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-purple-600 border-purple-600 text-white shadow-2xs font-bold"
                    : "bg-white border-[#D8D8D8] text-[#666666] hover:bg-gray-100"
                }`}
              >
                {details.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Type reminder note..."
            className="flex-1 text-xs bg-white border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-600 font-medium"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold p-1.5 rounded-lg transition-all flex items-center justify-center shrink-0 shadow-sm active:scale-95 cursor-pointer"
            title="Add reminder"
          >
            <Plus size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

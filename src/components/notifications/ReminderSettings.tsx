/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNotifications } from "../../providers/NotificationProvider";
import { 
  Bell, 
  Calendar, 
  Phone, 
  CheckSquare, 
  Clock, 
  FileText, 
  Award, 
  Cpu, 
  Moon, 
  Sparkles,
  Lock,
  Save
} from "lucide-react";

export const ReminderSettings: React.FC = () => {
  const { settings, updateSettings } = useNotifications();

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === "boolean") {
      updateSettings({ [key]: !settings[key] });
    }
  };

  const handleTimeChange = (key: "quietHoursStart" | "quietHoursEnd", val: string) => {
    updateSettings({ [key]: val });
  };

  const toggleItems = [
    {
      key: "meetings" as const,
      label: "Meetings Scheduled",
      description: "Trigger warnings 10m, 30m, and 1hr before calendar slots",
      icon: <Calendar size={16} className="text-emerald-600" />
    },
    {
      key: "calls" as const,
      label: "Voice & Callback Logs",
      description: "Notify on scheduled client call back intervals",
      icon: <Phone size={16} className="text-blue-600" />
    },
    {
      key: "tasks" as const,
      label: "Workday Task Expirations",
      description: "Alert immediately when workday plan objectives breach targets",
      icon: <CheckSquare size={16} className="text-amber-600" />
    },
    {
      key: "followups" as const,
      label: "Client follow-up SLA Breaches",
      description: "SLA tracking warns if active leads become cold or neglected",
      icon: <Clock size={16} className="text-purple-600" />
    },
    {
      key: "proposals" as const,
      label: "Proposal & Contract Reminders",
      description: "Urge dynamic retries on delivered enterprise estimates",
      icon: <FileText size={16} className="text-indigo-600" />
    },
    {
      key: "achievements" as const,
      label: "Gamified Achievement Alerts",
      description: "Unlock beautiful animations when keeping daily streaks active",
      icon: <Award size={16} className="text-orange-500" />
    },
    {
      key: "system" as const,
      label: "Integration System Alerts",
      description: "Log background sync reports from external XML import feeds",
      icon: <Cpu size={16} className="text-gray-600" />
    },
    {
      key: "ai" as const,
      label: "Cognitive AI Insights",
      description: "Trigger real-time alert updates based on proposal page visits",
      icon: <Sparkles size={16} className="text-violet-600 animate-pulse" />
    }
  ];

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-6 text-left space-y-6" id="reminder-settings-panel">
      
      {/* SECTION HEADER */}
      <div className="space-y-1">
        <h3 className="text-base font-bold text-[#2F2F2F] flex items-center gap-2">
          <Bell size={18} className="text-purple-600" />
          <span>Notification & Alert Filters</span>
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">
          Control which events generate in-app toasts and feed reminders. Suppressed notification types will not disturb your active timeline logs.
        </p>
      </div>

      {/* TOGGLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toggleItems.map((item) => (
          <div
            key={item.key}
            className="p-3.5 border border-[#EBEBEB] rounded-xl flex items-start gap-3 hover:border-purple-200 transition-all bg-[#FAF9FC]/30"
          >
            <div className="p-2 bg-white border border-[#EBEBEB] rounded-lg shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0 space-y-0.5 text-left">
              <label className="text-xs font-bold text-[#2F2F2F] block">
                {item.label}
              </label>
              <span className="text-[10px] text-gray-500 font-medium leading-relaxed block">
                {item.description}
              </span>
            </div>

            {/* Premium switch slider */}
            <button
              type="button"
              onClick={() => handleToggle(item.key)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600/20 mt-1 ${
                settings[item.key] ? "bg-purple-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings[item.key] ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* QUIET HOURS SECTION */}
      <div className="border-t border-[#EBEBEB] pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-[#2F2F2F] flex items-center gap-1.5">
              <Moon size={14} className="text-indigo-600" /> Focus-Ready Quiet Hours
            </h4>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-md">
              Automatically suppress non-critical notification prompts during configured focus buffers. High priority and Escalated Alerts bypass this threshold.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleToggle("quietHoursEnabled")}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600/20 ${
              settings.quietHoursEnabled ? "bg-purple-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                settings.quietHoursEnabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {settings.quietHoursEnabled && (
          <div className="bg-[#FAF9FC] border border-[#DDD3E6] p-4 rounded-xl flex flex-wrap gap-4 items-center animate-in slide-in-from-top-1 duration-150">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2F2F2F]">
              <span>Silence From:</span>
              <input
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => handleTimeChange("quietHoursStart", e.target.value)}
                className="bg-white border border-[#D8D8D8] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2F2F2F]">
              <span>Silence Until:</span>
              <input
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => handleTimeChange("quietHoursEnd", e.target.value)}
                className="bg-white border border-[#D8D8D8] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>
            <span className="text-[10px] text-purple-600 font-extrabold font-mono bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100 flex items-center gap-1 ml-auto">
              <Lock size={10} /> Active Filter Connected
            </span>
          </div>
        )}
      </div>

    </div>
  );
};
export default ReminderSettings;

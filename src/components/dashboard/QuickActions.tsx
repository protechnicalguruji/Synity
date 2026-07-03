/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserPlus, Upload, Calendar, CheckSquare } from "lucide-react";
import { Card } from "../ui/Card";

interface QuickActionsProps {
  onAddLead: () => void;
  onImportLeads: () => void;
  onScheduleMeeting: () => void;
  onAddTask: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddLead,
  onImportLeads,
  onScheduleMeeting,
  onAddTask
}) => {
  const actions = [
    {
      id: "qa-add-lead",
      title: "Add Lead",
      description: "Register prospective deal",
      icon: <UserPlus className="text-blue-600" size={18} />,
      onClick: onAddLead,
      color: "hover:border-blue-300 hover:bg-blue-50/15"
    },
    {
      id: "qa-import",
      title: "Import Leads",
      description: "Batch CSV / XLSX upload",
      icon: <Upload className="text-purple-600" size={18} />,
      onClick: onImportLeads,
      color: "hover:border-purple-300 hover:bg-purple-50/15"
    },
    {
      id: "qa-meeting",
      title: "Schedule Meeting",
      description: "Log active calendars",
      icon: <Calendar className="text-amber-600" size={18} />,
      onClick: onScheduleMeeting,
      color: "hover:border-amber-300 hover:bg-amber-50/15"
    },
    {
      id: "qa-task",
      title: "Create Task",
      description: "Schedule workday item",
      icon: <CheckSquare className="text-emerald-600" size={18} />,
      onClick: onAddTask,
      color: "hover:border-emerald-300 hover:bg-emerald-50/15"
    }
  ];

  return (
    <Card
      id="quick-actions-widget"
      title={<span className="font-display font-bold text-[#2F2F2F]">Quick Administration Shortcuts</span>}
      description="Perform high-frequency sales activities directly with zero friction."
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-2">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={act.onClick}
            className={`p-4 text-left border border-[#D8D8D8] rounded-xl transition-all duration-200 flex flex-col justify-between h-28 cursor-pointer group bg-white ${act.color}`}
          >
            <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 w-fit group-hover:scale-105 transition-transform">
              {act.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-[#2F2F2F] tracking-tight">{act.title}</p>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">{act.description}</p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

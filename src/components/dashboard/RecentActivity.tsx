/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Phone, MessageSquare, Handshake, FileText, CheckCircle2, XCircle, Sparkles, UserPlus, Trash2 } from "lucide-react";
import { Card } from "../ui/Card";
import { ActivityLog } from "../../types";
import { formatDate, formatDateTime } from "../../utils";

interface RecentActivityProps {
  activities: ActivityLog[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  // Sort by timestamp desc (newest first)
  const sortedActivities = [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

  const getActivityVisuals = (act: ActivityLog) => {
    const title = act.title.toLowerCase();
    const desc = act.description.toLowerCase();

    if (title.includes("won") || title.includes("closed won") || desc.includes("closed won")) {
      return {
        icon: <CheckCircle2 size={13} className="text-emerald-500" />,
        bgColor: "bg-emerald-50 border-emerald-100"
      };
    }
    if (title.includes("lost") || title.includes("closed lost") || desc.includes("closed lost")) {
      return {
        icon: <XCircle size={13} className="text-rose-500" />,
        bgColor: "bg-rose-50 border-rose-100"
      };
    }
    if (title.includes("call") || desc.includes("call")) {
      return {
        icon: <Phone size={13} className="text-blue-500" />,
        bgColor: "bg-blue-50 border-blue-100"
      };
    }
    if (title.includes("meeting") || title.includes("sync") || desc.includes("meeting")) {
      return {
        icon: <Handshake size={13} className="text-amber-500" />,
        bgColor: "bg-amber-50 border-amber-100"
      };
    }
    if (title.includes("proposal") || desc.includes("proposal")) {
      return {
        icon: <FileText size={13} className="text-purple-500" />,
        bgColor: "bg-purple-50 border-purple-100"
      };
    }
    if (title.includes("registered") || title.includes("added") || title.includes("opportunity")) {
      return {
        icon: <UserPlus size={13} className="text-[#3b7194]" />,
        bgColor: "bg-[#8CB9D7]/15 border-[#8CB9D7]/30"
      };
    }
    return {
      icon: <Sparkles size={13} className="text-gray-500" />,
      bgColor: "bg-gray-50 border-gray-100"
    };
  };

  return (
    <Card
      id="recent-activities-widget"
      title={<span className="font-display font-bold text-[#2F2F2F]">Live Sales Stream Feed</span>}
      description="Live sequence of outreach activities, stage transitions, and deals won."
    >
      {sortedActivities.length === 0 ? (
        <div className="text-center py-8 text-xs text-gray-500">
          No activities recorded in this session. Start logging outreach to seed!
        </div>
      ) : (
        <div className="relative pl-6 space-y-4.5 mt-3 text-left">
          {/* Timeline connecting bar */}
          <div className="absolute left-2.5 top-1 bottom-1.5 w-0.5 bg-[#E5E3E7]" />

          {sortedActivities.map((act) => {
            const visuals = getActivityVisuals(act);
            return (
              <div key={act.id} className="relative flex items-start gap-3.5">
                {/* Visual node icon */}
                <div className={`absolute -left-5.5 mt-1.5 h-6.5 w-6.5 rounded-full border flex items-center justify-center shrink-0 z-10 bg-white ${visuals.bgColor}`}>
                  {visuals.icon}
                </div>

                <div className="flex-1 space-y-1 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-xs font-bold text-[#2F2F2F] leading-tight">
                      {act.title}
                    </p>
                    <span className="text-[9px] font-mono text-gray-400 font-bold shrink-0">
                      {formatDateTime(act.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-[#666666] leading-normal font-medium">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold">
                    <span>Logged by:</span>
                    <span className="text-[#4E4E49] bg-[#E5E3E7]/40 rounded px-1">{act.userName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

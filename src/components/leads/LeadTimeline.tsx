import React, { useState } from "react";
import { Phone, MessageSquare, Mail, Calendar, Edit3, UserPlus, Trophy, AlertTriangle, GitCommit, Play, Plus, Clock } from "lucide-react";
import { ActivityLog, ActivityType } from "../../types";
import { formatDateTime } from "../../utils";
import { Button } from "../ui/Button";

interface LeadTimelineProps {
  activities: ActivityLog[];
  onAddActivity: (type: ActivityType, title: string, description: string) => void;
}

export const LeadTimeline: React.FC<LeadTimelineProps> = ({
  activities,
  onAddActivity
}) => {
  const [showLogForm, setShowLogForm] = useState(false);
  const [logType, setLogType] = useState<ActivityType>(ActivityType.CALL);
  const [logTitle, setLogTitle] = useState("");
  const [logDesc, setLogDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle.trim() || !logDesc.trim()) return;

    onAddActivity(logType, logTitle.trim(), logDesc.trim());
    setLogTitle("");
    setLogDesc("");
    setShowLogForm(false);
  };

  const getActivityIcon = (type: ActivityType, title: string) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes("registered") || titleLower.includes("created")) {
      return {
        icon: <UserPlus size={14} />,
        color: "bg-blue-50 text-blue-600 border-blue-200/50"
      };
    }
    if (titleLower.includes("closed won") || titleLower.includes("won 🎉")) {
      return {
        icon: <Trophy size={14} />,
        color: "bg-emerald-50 text-emerald-600 border-emerald-200/50"
      };
    }
    if (titleLower.includes("closed lost") || titleLower.includes("removed") || titleLower.includes("lost")) {
      return {
        icon: <AlertTriangle size={14} />,
        color: "bg-red-50 text-red-600 border-red-200/50"
      };
    }
    if (titleLower.includes("whatsapp")) {
      return {
        icon: <MessageSquare size={14} />,
        color: "bg-emerald-50 text-emerald-600 border-emerald-200/50"
      };
    }

    switch (type) {
      case ActivityType.CALL:
        return {
          icon: <Phone size={14} />,
          color: "bg-blue-50 text-blue-600 border-blue-200/50"
        };
      case ActivityType.EMAIL:
        return {
          icon: <Mail size={14} />,
          color: "bg-indigo-50 text-indigo-600 border-indigo-200/50"
        };
      case ActivityType.MEETING:
        return {
          icon: <Calendar size={14} />,
          color: "bg-purple-50 text-purple-600 border-purple-200/50"
        };
      case ActivityType.STATE_CHANGE:
        return {
          icon: <GitCommit size={14} />,
          color: "bg-amber-50 text-amber-600 border-amber-200/50"
        };
      case ActivityType.NOTE:
      default:
        return {
          icon: <Edit3 size={14} />,
          color: "bg-gray-50 text-gray-600 border-gray-200/50"
        };
    }
  };

  return (
    <div className="space-y-5 text-left">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#666666]">Activity Timeline</h4>
        <Button
          size="xs"
          variant="outline"
          className="bg-white border-[#D8D8D8] text-[11px] font-semibold flex items-center gap-1.5"
          onClick={() => setShowLogForm(!showLogForm)}
        >
          <Plus size={12} />
          Log Activity
        </Button>
      </div>

      {showLogForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border border-[#D8D8D8] rounded-xl space-y-3 animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Log Type</label>
              <select
                value={logType}
                onChange={(e) => setLogType(e.target.value as ActivityType)}
                className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 text-[#2F2F2F] outline-none"
              >
                <option value={ActivityType.CALL}>Call Log</option>
                <option value={ActivityType.EMAIL}>Email Sendout</option>
                <option value={ActivityType.MEETING}>Meeting Sync</option>
                <option value={ActivityType.NOTE}>Internal Note</option>
                <option value={ActivityType.STATE_CHANGE}>Pipeline Switch</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Activity Title</label>
              <input
                type="text"
                placeholder="e.g. Left voicemail, Sent custom slides"
                value={logTitle}
                onChange={(e) => setLogTitle(e.target.value)}
                required
                className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Short Summary</label>
            <textarea
              placeholder="Provide a concise timeline description..."
              value={logDesc}
              onChange={(e) => setLogDesc(e.target.value)}
              required
              rows={2}
              className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button size="xs" variant="ghost" onClick={() => setShowLogForm(false)}>
              Cancel
            </Button>
            <Button size="xs" className="bg-[#4E4E49] hover:bg-[#3D3D38] text-white" type="submit">
              Post Log
            </Button>
          </div>
        </form>
      )}

      {activities.length === 0 ? (
        <div className="text-center py-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
          <p className="text-xs text-gray-400">No logs registered yet. Create your first timeline entry.</p>
        </div>
      ) : (
        <div className="relative border-l border-gray-200 ml-3.5 pl-6 space-y-6">
          {activities.map((act) => {
            const style = getActivityIcon(act.type, act.title);
            return (
              <div key={act.id} className="relative animate-fade-in">
                {/* Circle marker */}
                <span className={`absolute -left-[35px] top-0.5 flex items-center justify-center h-7 w-7 rounded-full border shadow-2xs ${style.color}`}>
                  {style.icon}
                </span>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h5 className="font-semibold text-xs text-[#2F2F2F]">{act.title}</h5>
                    <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1 shrink-0">
                      <Clock size={10} />
                      {formatDateTime(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed whitespace-pre-wrap">{act.description}</p>
                  <p className="text-[10px] text-gray-400">Logged by: <strong className="font-semibold">{act.userName || "Alex Rivers"}</strong></p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

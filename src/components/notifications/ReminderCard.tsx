/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AppNotification, NotificationPriority, NotificationStatus } from "../../types/notification";
import { useNotifications } from "../../providers/NotificationProvider";
import { Calendar, Clock, AlertCircle, CheckCircle, Flame, User, Play, RefreshCw } from "lucide-react";

interface ReminderCardProps {
  reminder: AppNotification;
  onOpenSnooze: (title: string, id: string) => void;
  onOpenLeadProfile?: (leadId: string) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onOpenSnooze,
  onOpenLeadProfile
}) => {
  const { updateNotificationStatus, togglePinNotification } = useNotifications();

  // Check if reminder is overdue
  const isOverdue = reminder.dueDate && new Date(reminder.dueDate).getTime() < Date.now() && reminder.status !== NotificationStatus.COMPLETED;

  // Highlight when less than one hour remains (milestone rule)
  const isLessThanOneHourLeft = reminder.dueDate && !isOverdue && reminder.status === NotificationStatus.ACTIVE &&
    (new Date(reminder.dueDate).getTime() - Date.now() < 3600000);

  return (
    <div
      className={`p-4 rounded-xl border transition-all text-left space-y-3 ${
        isOverdue
          ? "bg-rose-50/10 border-rose-300"
          : isLessThanOneHourLeft
          ? "bg-amber-50/20 border-amber-300 ring-1 ring-amber-200"
          : "bg-white border-[#D8D8D8] hover:border-purple-300"
      }`}
      id={`reminder-card-${reminder.id}`}
    >
      {/* CARD TOP ROW */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              {reminder.type.replace(/_/g, " ")}
            </span>
            {isOverdue && (
              <span className="text-[9px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse flex items-center gap-1">
                <Flame size={9} /> OVERDUE
              </span>
            )}
            {isLessThanOneHourLeft && (
              <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse flex items-center gap-1">
                <Clock size={9} /> LESS THAN 1HR LEFT
              </span>
            )}
          </div>
          <h4 className="text-xs font-bold text-[#2F2F2F] leading-snug">{reminder.title}</h4>
        </div>

        {/* Priority chip */}
        <span
          className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
            reminder.priority === NotificationPriority.CRITICAL
              ? "bg-rose-600 text-white"
              : reminder.priority === NotificationPriority.HIGH
              ? "bg-amber-500 text-white"
              : reminder.priority === NotificationPriority.MEDIUM
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {reminder.priority}
        </span>
      </div>

      {/* Description */}
      {reminder.description && (
        <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
          {reminder.description}
        </p>
      )}

      {/* Leads metadata and date timers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-dashed border-[#EBEBEB] text-[10px] text-gray-500 font-semibold">
        <div className="flex items-center gap-2">
          {reminder.leadRef && (
            <button
              onClick={() => onOpenLeadProfile?.(reminder.leadRef!.id)}
              className="flex items-center gap-1 hover:text-purple-700 transition-colors cursor-pointer"
            >
              <User size={12} className="text-gray-400" />
              <span>{reminder.leadRef.name}</span>
            </button>
          )}

          {reminder.dueDate && (
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar size={12} className="text-gray-400" />
              <span>
                {new Date(reminder.dueDate).toLocaleDateString([], { month: "short", day: "numeric" })} @{" "}
                {new Date(reminder.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          )}
        </div>

        {/* Action Tray */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          {reminder.status === NotificationStatus.ACTIVE && (
            <>
              <button
                onClick={() => updateNotificationStatus(reminder.id, NotificationStatus.COMPLETED)}
                className="p-1 text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                title="Mark Completed"
              >
                <CheckCircle size={12} />
              </button>
              <button
                onClick={() => onOpenSnooze(reminder.title, reminder.id)}
                className="p-1 text-xs font-bold bg-white hover:bg-gray-50 text-gray-600 border border-[#D8D8D8] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                title="Snooze Alert"
              >
                <Clock size={12} />
              </button>
            </>
          )}

          {reminder.status === NotificationStatus.COMPLETED && (
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1">
              <CheckCircle size={10} /> Completed
            </span>
          )}

          {reminder.status === NotificationStatus.SNOOZED && (
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1">
              <Clock size={10} /> Snoozed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReminderCard;

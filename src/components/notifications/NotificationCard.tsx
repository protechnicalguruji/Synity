/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppNotification, NotificationType, NotificationPriority, NotificationStatus } from "../../types/notification";
import { useNotifications } from "../../providers/NotificationProvider";
import {
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  Pin,
  Check,
  Trash2,
  FileText,
  User,
  ShieldCheck,
  Download,
  AlertTriangle,
  Flame,
  ArrowUpRight
} from "lucide-react";
import { formatDateTime } from "../../utils";

interface NotificationCardProps {
  notification: AppNotification;
  onOpenSnooze: (title: string, id: string) => void;
  onOpenLeadProfile?: (leadId: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onOpenSnooze,
  onOpenLeadProfile
}) => {
  const {
    togglePinNotification,
    updateNotificationStatus,
    deleteNotification,
    addToast
  } = useNotifications();

  // Color mapping based on priority
  const getPriorityStyle = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.CRITICAL:
        return {
          border: "border-rose-400 bg-rose-50/10",
          badge: "bg-rose-500 text-white font-black animate-pulse",
          text: "text-rose-700"
        };
      case NotificationPriority.HIGH:
        return {
          border: "border-amber-300 bg-amber-50/5",
          badge: "bg-amber-500 text-white font-extrabold",
          text: "text-amber-700"
        };
      case NotificationPriority.MEDIUM:
        return {
          border: "border-blue-200 bg-blue-50/5",
          badge: "bg-blue-500 text-white font-bold",
          text: "text-blue-700"
        };
      case NotificationPriority.LOW:
        return {
          border: "border-[#D8D8D8] bg-gray-50/5",
          badge: "bg-gray-400 text-white font-semibold",
          text: "text-gray-600"
        };
    }
  };

  // Icon mapping based on notification type
  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.UPCOMING_CALL:
        return <Phone size={14} className="text-blue-600" />;
      case NotificationType.UPCOMING_MEETING:
        return <Calendar size={14} className="text-emerald-600" />;
      case NotificationType.FOLLOW_UP_DUE:
        return <Clock size={14} className="text-purple-600" />;
      case NotificationType.OVERDUE_FOLLOW_UP:
        return <Flame size={14} className="text-rose-600" />;
      case NotificationType.TASK_DUE:
        return <AlertCircle size={14} className="text-amber-600" />;
      case NotificationType.PROPOSAL_REMINDER:
        return <FileText size={14} className="text-indigo-600" />;
      case NotificationType.LEAD_BECOMING_COLD:
        return <AlertTriangle size={14} className="text-orange-500" />;
      case NotificationType.DEAL_CLOSED:
        return <ShieldCheck size={14} className="text-emerald-600" />;
      case NotificationType.DEAL_LOST:
        return <AlertCircle size={14} className="text-gray-500" />;
      case NotificationType.IMPORT_COMPLETED:
        return <Download size={14} className="text-indigo-600" />;
      case NotificationType.AI_INSIGHT:
        return <Sparkles size={14} className="text-violet-600" />;
      case NotificationType.ACHIEVEMENT:
        return <Sparkles size={14} className="text-amber-500" />;
      case NotificationType.SYSTEM_NOTIFICATION:
        return <AlertCircle size={14} className="text-gray-600" />;
    }
  };

  const priorityStyle = getPriorityStyle(notification.priority);

  const handleCallSimulation = () => {
    if (!notification.leadRef?.phone) return;
    addToast(
      "Dialer Dispatched",
      `Dialing ${notification.leadRef.name} at ${notification.leadRef.phone}...`,
      "info",
      4000
    );
    // Update state
    updateNotificationStatus(notification.id, NotificationStatus.COMPLETED);
  };

  return (
    <div
      className={`p-4 rounded-2xl border bg-white transition-all hover:shadow-xs flex gap-3 text-left relative overflow-hidden ${
        notification.isRead ? "opacity-75" : ""
      } ${notification.isPinned ? "ring-1 ring-purple-300 bg-purple-50/10" : ""} ${priorityStyle.border}`}
      id={`notif-card-${notification.id}`}
    >
      {/* Escalation ribbon watermark */}
      {notification.isEscalated && (
        <div className="absolute top-0 right-0 bg-rose-600 text-[8px] text-white font-extrabold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-widest animate-pulse">
          Escalated Alert
        </div>
      )}

      {/* ICON HOUSING */}
      <div className="shrink-0">
        <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
          {getTypeIcon(notification.type)}
        </div>
      </div>

      {/* CONTENT ROW */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-[#2F2F2F] leading-snug flex items-center gap-1.5 flex-wrap">
              {notification.title}
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${priorityStyle.badge}`}>
                {notification.priority}
              </span>
            </h4>
            <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
              {notification.description}
            </p>
          </div>

          {/* RIGHT ACTION FLAPS */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => togglePinNotification(notification.id)}
              className={`p-1 rounded-lg border transition-all cursor-pointer ${
                notification.isPinned
                  ? "bg-purple-100 border-purple-200 text-purple-700 font-extrabold"
                  : "bg-white border-[#D8D8D8] text-gray-400 hover:text-gray-700"
              }`}
              title={notification.isPinned ? "Unpin notification" : "Pin to top"}
            >
              <Pin size={11} className={notification.isPinned ? "rotate-45 fill-purple-100" : "rotate-45"} />
            </button>
            <button
              onClick={() => deleteNotification(notification.id)}
              className="p-1 bg-white border border-[#D8D8D8] text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              title="Delete alert"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>

        {/* METADATA CHIPS (LEAD REFERENCE & TIMESTAMP) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-dashed border-gray-100">
          <span className="text-[9px] font-mono font-medium text-gray-400">
            {formatDateTime(notification.timestamp)}
          </span>

          {notification.leadRef && (
            <button
              onClick={() => onOpenLeadProfile?.(notification.leadRef!.id)}
              className="text-[9px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-md px-1.5 py-0.5 flex items-center gap-1 transition-all cursor-pointer"
            >
              <User size={9} />
              <span>{notification.leadRef.name} ({notification.leadRef.company || "No Company"})</span>
              <ArrowUpRight size={8} />
            </button>
          )}

          {notification.dueDate && (
            <span className="text-[9px] font-bold text-gray-600 bg-gray-100 rounded-md px-1.5 py-0.5 flex items-center gap-1">
              <Clock size={9} />
              <span>Target: {new Date(notification.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </span>
          )}

          {notification.isEscalated && notification.escalationReason && (
            <span className="text-[9px] font-bold text-rose-600 bg-rose-50 rounded-md px-1.5 py-0.5 border border-rose-100">
              Breach Alert: {notification.escalationReason}
            </span>
          )}
        </div>

        {/* BOTTOM ACTION TRAY */}
        {notification.status === NotificationStatus.ACTIVE && (
          <div className="flex items-center gap-1.5 pt-1.5">
            {/* Quick outbound actions depending on type */}
            {notification.leadRef?.phone && notification.type === NotificationType.UPCOMING_CALL && (
              <button
                onClick={handleCallSimulation}
                className="px-2.5 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-3xs"
              >
                <Phone size={10} /> Call Now
              </button>
            )}

            {notification.leadRef && (
              <button
                onClick={() => onOpenLeadProfile?.(notification.leadRef!.id)}
                className="px-2.5 py-1 text-[10px] font-bold bg-gray-50 hover:bg-gray-100 text-[#2F2F2F] border border-[#D8D8D8] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                View Lead
              </button>
            )}

            {/* General mark complete / snooze buttons */}
            <button
              onClick={() => updateNotificationStatus(notification.id, NotificationStatus.COMPLETED)}
              className="px-2.5 py-1 text-[10px] font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-3xs"
            >
              <Check size={10} /> Complete
            </button>

            <button
              onClick={() => onOpenSnooze(notification.title, notification.id)}
              className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-gray-100 text-gray-600 border border-[#D8D8D8] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <Clock size={10} /> Snooze
            </button>

            <button
              onClick={() => updateNotificationStatus(notification.id, NotificationStatus.DISMISSED)}
              className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-rose-50 hover:text-rose-600 text-gray-500 border border-[#D8D8D8] hover:border-rose-200 rounded-lg transition-all cursor-pointer ml-auto"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Status markers if archived or snoozed */}
        {notification.status === NotificationStatus.SNOOZED && (
          <div className="flex items-center gap-1 pt-1">
            <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md flex items-center gap-1">
              <Clock size={9} /> Snoozed until {new Date(notification.dueDate!).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={() => updateNotificationStatus(notification.id, NotificationStatus.ACTIVE)}
              className="text-[9px] font-bold text-purple-700 hover:underline cursor-pointer ml-2"
            >
              Un-snooze
            </button>
          </div>
        )}

        {notification.status === NotificationStatus.COMPLETED && (
          <div className="pt-0.5">
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1">
              <Check size={9} /> Handled
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default NotificationCard;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AppNotification, NotificationStatus, NotificationType } from "../../types/notification";
import { useNotifications } from "../../providers/NotificationProvider";
import { Flame, Calendar, Clock, ChevronRight, User } from "lucide-react";

interface ReminderTimelineProps {
  onOpenLeadProfile?: (leadId: string) => void;
}

export const ReminderTimeline: React.FC<ReminderTimelineProps> = ({
  onOpenLeadProfile
}) => {
  const { notifications } = useNotifications();

  // Filter follow-up reminders
  const followUps = notifications.filter(
    (n) =>
      (n.type === NotificationType.FOLLOW_UP_DUE ||
        n.type === NotificationType.OVERDUE_FOLLOW_UP) &&
      n.status === NotificationStatus.ACTIVE
  );

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
  const startOfAfterTomorrow = new Date(startOfTomorrow.getTime() + 86400000);

  // Grouping
  const overdueItems: AppNotification[] = [];
  const todayItems: AppNotification[] = [];
  const tomorrowItems: AppNotification[] = [];
  const upcomingItems: AppNotification[] = [];

  followUps.forEach((item) => {
    if (!item.dueDate) {
      upcomingItems.push(item);
      return;
    }

    const dueTime = new Date(item.dueDate).getTime();
    if (dueTime < now.getTime()) {
      overdueItems.push(item);
    } else if (dueTime < startOfTomorrow.getTime()) {
      todayItems.push(item);
    } else if (dueTime < startOfAfterTomorrow.getTime()) {
      tomorrowItems.push(item);
    } else {
      upcomingItems.push(item);
    }
  });

  const GroupHeader = ({ label, count, icon, colorClass }: { label: string; count: number; icon: React.ReactNode; colorClass: string }) => (
    <div className="flex items-center justify-between border-b border-gray-100 pb-1 pt-3">
      <div className="flex items-center gap-1.5 text-xs font-extrabold tracking-tight">
        <span className={colorClass}>{icon}</span>
        <span className="text-[#2F2F2F]">{label}</span>
      </div>
      <span className="text-[10px] font-mono font-bold bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full">
        {count} items
      </span>
    </div>
  );

  const renderItem = (item: AppNotification) => (
    <div
      key={item.id}
      className="p-3 bg-[#FAF9FC]/50 hover:bg-purple-50 border border-[#EBEBEB] hover:border-purple-200 rounded-xl transition-all flex items-start gap-3 text-left"
    >
      <div className="mt-0.5 p-1 bg-white border border-[#EBEBEB] rounded-lg text-purple-700">
        <Clock size={12} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-xs font-bold text-[#2F2F2F] leading-snug">{item.title}</p>
        <p className="text-[10px] text-gray-500 leading-relaxed truncate">{item.description}</p>
        
        {item.leadRef && (
          <button
            onClick={() => onOpenLeadProfile?.(item.leadRef!.id)}
            className="text-[9px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-md px-1.5 py-0.5 flex items-center gap-1 transition-all cursor-pointer inline-flex"
          >
            <User size={8} />
            <span>{item.leadRef.name}</span>
          </button>
        )}
      </div>
      {item.dueDate && (
        <span className="text-[9px] font-mono text-gray-400 self-center">
          {new Date(item.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </div>
  );

  const hasItems = overdueItems.length > 0 || todayItems.length > 0 || tomorrowItems.length > 0 || upcomingItems.length > 0;

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl p-4 space-y-4" id="reminder-timeline-hud">
      <div className="space-y-0.5 text-left">
        <h4 className="text-xs font-bold text-[#2F2F2F]">Timeline SLA Follow-ups</h4>
        <p className="text-[10px] text-gray-500 leading-relaxed font-semibold">
          Proactively tracking and grouping contact SLA status loops to secure lead retention.
        </p>
      </div>

      {!hasItems ? (
        <div className="text-center p-8 text-xs text-gray-400 font-semibold space-y-1">
          <p>No active follow-ups mapped.</p>
          <p className="text-[10px] font-medium text-gray-400">All client interactions are synchronized!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* OVERDUE */}
          {overdueItems.length > 0 && (
            <div className="space-y-2">
              <GroupHeader label="Overdue Breaches" count={overdueItems.length} icon={<Flame size={13} />} colorClass="text-rose-600 animate-pulse" />
              <div className="space-y-1.5">{overdueItems.map(renderItem)}</div>
            </div>
          )}

          {/* TODAY */}
          {todayItems.length > 0 && (
            <div className="space-y-2">
              <GroupHeader label="Due Today" count={todayItems.length} icon={<Clock size={13} />} colorClass="text-amber-500" />
              <div className="space-y-1.5">{todayItems.map(renderItem)}</div>
            </div>
          )}

          {/* TOMORROW */}
          {tomorrowItems.length > 0 && (
            <div className="space-y-2">
              <GroupHeader label="Due Tomorrow" count={tomorrowItems.length} icon={<Calendar size={13} />} colorClass="text-blue-500" />
              <div className="space-y-1.5">{tomorrowItems.map(renderItem)}</div>
            </div>
          )}

          {/* UPCOMING */}
          {upcomingItems.length > 0 && (
            <div className="space-y-2">
              <GroupHeader label="Upcoming Actions" count={upcomingItems.length} icon={<ChevronRight size={13} />} colorClass="text-gray-400" />
              <div className="space-y-1.5">{upcomingItems.map(renderItem)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ReminderTimeline;

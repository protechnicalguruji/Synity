/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNotifications } from "../../providers/NotificationProvider";
import { AppNotification, NotificationStatus, NotificationPriority, NotificationType } from "../../types/notification";
import { NotificationCard } from "./NotificationCard";
import { ReminderCard } from "./ReminderCard";
import { DigestCard } from "./DigestCard";
import { ReminderSettings } from "./ReminderSettings";
import { ReminderTimeline } from "./ReminderTimeline";
import { SnoozeDialog } from "./SnoozeDialog";
import {
  Bell,
  CheckCheck,
  Zap,
  Sparkles,
  Settings,
  Filter,
  RefreshCw,
  AlertOctagon,
  Clock,
  Pin,
  ListFilter,
  LayoutGrid,
  History,
  Archive,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface NotificationCenterProps {
  onOpenLeadProfile?: (leadId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onOpenLeadProfile
}) => {
  const {
    notifications,
    settings,
    digests,
    markAllAsRead,
    snoozeNotification,
    generateDigest,
    simulateRealtimeNotification
  } = useNotifications();

  // Primary Workspace tab (FEED vs SETTINGS vs TIMELINE vs DIGESTS)
  const [activePane, setActivePane] = useState<"FEED" | "TIMELINE" | "DIGESTS" | "SETTINGS">("FEED");

  // Filter inside the feed: ALL, UNREAD, PINNED, ARCHIVED, DISMISSED
  const [feedFilter, setFeedFilter] = useState<"ALL" | "UNREAD" | "PINNED" | "ARCHIVED" | "DISMISSED">("ALL");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Simulated Async Loading
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false);

  // Connection Error simulation toggle
  const [syncError, setSyncError] = useState(false);

  // SnoozeDialog Control State
  const [snoozeTarget, setSnoozeTarget] = useState<{ title: string; id: string } | null>(null);

  // Pagination bounds
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Trigger loading spinner briefly when filter swaps for crisp polish
  const handleFilterChange = (filter: typeof feedFilter) => {
    setFeedFilter(filter);
    setCurrentPage(1);
    setShowSkeletons(true);
    setTimeout(() => {
      setShowSkeletons(false);
    }, 400);
  };

  const handleSyncOperation = () => {
    setIsSyncing(true);
    setSyncError(false);
    setTimeout(() => {
      setIsSyncing(false);
      // 10% chance of simulated error to demonstrate resilient retry UI
      if (Math.random() < 0.1) {
        setSyncError(true);
      }
    }, 800);
  };

  // Group notifications chronologically
  const groupNotifications = (notifs: AppNotification[]) => {
    const today: AppNotification[] = [];
    const yesterday: AppNotification[] = [];
    const earlier: AppNotification[] = [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;

    notifs.forEach((n) => {
      const time = new Date(n.timestamp).getTime();
      if (time >= startOfToday) {
        today.push(n);
      } else if (time >= startOfYesterday) {
        yesterday.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, yesterday, earlier };
  };

  // Get matching filtered notifications
  const getFilteredNotifications = () => {
    return notifications.filter((n) => {
      // 1. Text filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(query);
        const matchDesc = n.description.toLowerCase().includes(query);
        const matchLead = n.leadRef?.name.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchLead) return false;
      }

      // 2. Feed categorization status filter
      switch (feedFilter) {
        case "ALL":
          return n.status === NotificationStatus.ACTIVE || n.status === NotificationStatus.SNOOZED;
        case "UNREAD":
          return !n.isRead && (n.status === NotificationStatus.ACTIVE || n.status === NotificationStatus.SNOOZED);
        case "PINNED":
          return n.isPinned && (n.status === NotificationStatus.ACTIVE || n.status === NotificationStatus.SNOOZED);
        case "ARCHIVED":
          return n.status === NotificationStatus.ARCHIVED;
        case "DISMISSED":
          return n.status === NotificationStatus.DISMISSED || n.status === NotificationStatus.COMPLETED;
      }
    });
  };

  const filteredNotifs = getFilteredNotifications();

  // Sorting priority: pinned stay at top, then date descending
  const sortedNotifs = [...filteredNotifs].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Paginated chunk
  const totalPages = Math.ceil(sortedNotifs.length / itemsPerPage) || 1;
  const paginatedNotifs = sortedNotifs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const { today, yesterday, earlier } = groupNotifications(paginatedNotifs);

  return (
    <div className="space-y-4 text-left h-full flex flex-col" id="notification-center-root">
      
      {/* 1. HEADER COCKPIT BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8D8D8] pb-5 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-wider">
              Smart Engine
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">Proactive SLA v2.4</span>
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-[#2F2F2F]">
            Notifications & Smart Reminders Cockpit
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl font-medium">
            Proactively coordinate upcoming meetings, overdue follow-ups, cognitive AI insight spikes, and platform actions. Prioritize, snooze, and automate client engagement.
          </p>
        </div>

        {/* Sync Controls / Simulator */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          
          {/* Real-time Simulator button */}
          <button
            type="button"
            onClick={simulateRealtimeNotification}
            className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Inject simulated inbound event (call reminder, cold risk, AI spike)"
          >
            <Zap size={13} className="text-amber-300 animate-pulse" />
            <span>Simulate Real-time Alert</span>
          </button>

          {/* Refresh/Sync button */}
          <button
            type="button"
            onClick={handleSyncOperation}
            className="p-2 bg-white hover:bg-gray-100 text-[#2F2F2F] border border-[#D8D8D8] rounded-xl transition-all cursor-pointer shadow-3xs flex items-center justify-center"
            title="Sync notification timeline queues"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* 2. ERROR STATE / RETRY UI */}
      {syncError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-top-2 duration-150" id="sync-error-banner">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <AlertOctagon size={24} />
          </div>
          <div className="flex-1 space-y-0.5 text-center sm:text-left">
            <h4 className="text-xs font-bold text-red-950">Synchronization Timeout</h4>
            <p className="text-[11px] text-red-700 leading-relaxed font-medium">
              The Sales OS pipeline failed to synchronize cached notification headers with downstream queues. Check network rules.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSyncOperation}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* 3. MULTI-TAB WORKSPACE NAVIGATION */}
      <div className="flex items-center gap-1 border-b border-[#EBEBEB] pb-px shrink-0">
        <button
          onClick={() => setActivePane("FEED")}
          className={`px-4 py-2 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activePane === "FEED"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Bell size={13} />
          <span>Active Feed</span>
          <span className="text-[9px] font-mono font-bold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full">
            {notifications.filter((n) => n.status === NotificationStatus.ACTIVE && !n.isRead).length}
          </span>
        </button>

        <button
          onClick={() => setActivePane("TIMELINE")}
          className={`px-4 py-2 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activePane === "TIMELINE"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Clock size={13} />
          <span>SLA Timeline</span>
        </button>

        <button
          onClick={() => setActivePane("DIGESTS")}
          className={`px-4 py-2 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activePane === "DIGESTS"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sparkles size={13} />
          <span>AI Intelligence Digests</span>
          <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full">
            {digests.length}
          </span>
        </button>

        <button
          onClick={() => setActivePane("SETTINGS")}
          className={`px-4 py-2 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activePane === "SETTINGS"
              ? "border-purple-600 text-purple-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Settings size={13} />
          <span>Reminders Config</span>
        </button>
      </div>

      {/* 4. WORKSPACE PANES */}
      <div className="flex-1 overflow-y-auto min-h-0">
        
        {/* PANE A: ACTIVE FEED WORKSPACE */}
        {activePane === "FEED" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch h-full">
            
            {/* LEFT FEED LIST COLUMN (col-span-8) */}
            <div className="lg:col-span-8 space-y-4 flex flex-col h-full">
              
              {/* Filter Controls Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9FC] border border-[#D8D8D8] p-3 rounded-2xl">
                
                {/* Search */}
                <input
                  type="text"
                  placeholder="Query feed alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-[#D8D8D8] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500 w-full sm:max-w-xs font-medium"
                />

                {/* Filters tab items */}
                <div className="flex flex-wrap items-center gap-1">
                  {(["ALL", "UNREAD", "PINNED", "ARCHIVED", "DISMISSED"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                        feedFilter === filter
                          ? "bg-purple-600 text-white"
                          : "bg-white text-gray-500 hover:text-gray-700 border border-[#D8D8D8]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Mark all as read button */}
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              </div>

              {/* SKELETON LOADERS SIMULATION */}
              {showSkeletons ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="h-24 bg-gray-100 rounded-2xl border border-gray-200" />
                  ))}
                </div>
              ) : sortedNotifs.length === 0 ? (
                /* EMPTY FEED VIEW */
                <div className="bg-white border border-[#D8D8D8] rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3 flex-1">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                    <Bell size={24} className="stroke-[1.5]" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-xs font-bold text-[#2F2F2F]">Clear Notifications Horizon</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                      No active items matching your current filters. Tap "Simulate Real-time Alert" to watch priority escalation routines.
                    </p>
                  </div>
                </div>
              ) : (
                /* ACTIVE LIST GROUPINGS (TODAY, YESTERDAY, EARLIER) */
                <div className="space-y-6 flex-1">
                  {/* Today Section */}
                  {today.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-bold text-purple-700 tracking-wider uppercase border-b border-[#FAF9FC] pb-1 flex items-center gap-1.5">
                        <Clock size={11} /> Today's Dynamic Alert Queue
                      </h4>
                      <div className="space-y-3">
                        {today.map((notif) => (
                          <NotificationCard
                            key={notif.id}
                            notification={notif}
                            onOpenSnooze={(title, id) => setSnoozeTarget({ title, id })}
                            onOpenLeadProfile={onOpenLeadProfile}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Yesterday Section */}
                  {yesterday.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase border-b border-[#FAF9FC] pb-1 flex items-center gap-1.5">
                        <History size={11} /> Yesterday's Activity
                      </h4>
                      <div className="space-y-3">
                        {yesterday.map((notif) => (
                          <NotificationCard
                            key={notif.id}
                            notification={notif}
                            onOpenSnooze={(title, id) => setSnoozeTarget({ title, id })}
                            onOpenLeadProfile={onOpenLeadProfile}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Earlier Section */}
                  {earlier.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase border-b border-[#FAF9FC] pb-1 flex items-center gap-1.5">
                        <Archive size={11} /> Earlier Logs
                      </h4>
                      <div className="space-y-3">
                        {earlier.map((notif) => (
                          <NotificationCard
                            key={notif.id}
                            notification={notif}
                            onOpenSnooze={(title, id) => setSnoozeTarget({ title, id })}
                            onOpenLeadProfile={onOpenLeadProfile}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. PAGINATION CONTROLS */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">
                      <span>
                        Showing Page {currentPage} of {totalPages} ({sortedNotifs.length} items)
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                          className="p-1.5 border border-[#D8D8D8] rounded-lg bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                          className="p-1.5 border border-[#D8D8D8] rounded-lg bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-all cursor-pointer"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT SIDE PANEL (col-span-4) - TIMELINE MINI VIEW */}
            <div className="lg:col-span-4 space-y-4">
              <ReminderTimeline onOpenLeadProfile={onOpenLeadProfile} />
            </div>

          </div>
        )}

        {/* PANE B: SLA TIMELINE DIRECTORY */}
        {activePane === "TIMELINE" && (
          <div className="max-w-3xl mx-auto space-y-4">
            <ReminderTimeline onOpenLeadProfile={onOpenLeadProfile} />
          </div>
        )}

        {/* PANE C: AI INTEGRATED DIGESTS SECTION */}
        {activePane === "DIGESTS" && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Digest Generation Dashboard Box */}
            <div className="bg-[#FAF9FC] border border-[#DDD3E6] rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-600 animate-pulse" /> Synthesis Intelligence Co-Pilot
                </h4>
                <p className="text-[11px] text-purple-700 leading-relaxed font-medium">
                  Trigger on-demand executive summaries tracking active deal velocities, critical action reminders, and optimal re-engagement targets.
                </p>
              </div>

              {/* Presets Grid */}
              <div className="flex items-center gap-2 flex-wrap">
                {(["MORNING", "EVENING", "WEEKLY"] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => generateDigest(preset)}
                    className="px-3 py-1.5 bg-white hover:bg-purple-100 text-purple-950 font-bold text-[10px] rounded-xl border border-[#DDD3E6] hover:border-purple-300 transition-all cursor-pointer flex items-center gap-1"
                  >
                    Generate {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Render historic digests list */}
            {digests.length === 0 ? (
              <div className="bg-white border border-[#D8D8D8] rounded-2xl p-8 text-center text-xs text-gray-400">
                No summaries synthesized yet. Use the cockpit triggers above.
              </div>
            ) : (
              <div className="space-y-4">
                {digests.map((digest) => (
                  <DigestCard
                    key={digest.id}
                    digest={digest}
                    onOpenLeadProfile={onOpenLeadProfile}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* PANE D: SETTINGS SECTION */}
        {activePane === "SETTINGS" && (
          <div className="max-w-3xl mx-auto">
            <ReminderSettings />
          </div>
        )}

      </div>

      {/* SNOOZE CONTROL DIALOG PORTAL */}
      <SnoozeDialog
        isOpen={snoozeTarget !== null}
        onClose={() => setSnoozeTarget(null)}
        notificationTitle={snoozeTarget?.title}
        onConfirm={(minutes) => {
          if (snoozeTarget) {
            snoozeNotification(snoozeTarget.id, minutes);
          }
        }}
      />

    </div>
  );
};
export default NotificationCenter;

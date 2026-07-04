/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Bell,
  Search,
  Plus,
  Sparkles,
  Menu,
  Check,
  Clock,
  ExternalLink,
  ShieldAlert,
  LogOut,
  Settings,
  User
} from "lucide-react";
import { Button } from "../ui/Button";
import { formatDateTime } from "../../utils";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../providers/AuthProvider";
import { useNotifications } from "../../providers/NotificationProvider";
import { NotificationStatus } from "../../types/notification";

export interface TopNavProps {
  onOpenMobileSidebar: () => void;
  onOpenNewLeadModal: () => void;
  onChangeTab?: (tab: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenMobileSidebar,
  onOpenNewLeadModal,
  onChangeTab,
}) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { notifications, markAllAsRead, deleteNotification } = useNotifications();

  // Filter to active/snoozed notifications in the top bar dropdown
  const activeNotifs = notifications.filter(
    (n) => n.status === NotificationStatus.ACTIVE || n.status === NotificationStatus.SNOOZED
  );
  const unreadCount = activeNotifs.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleClearNotif = (id: string) => {
    deleteNotification(id);
  };

  // Compute greeting based on time of day
  const hour = new Date().getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
  if (hour >= 17) greeting = "Good Evening";

  // Compute current date format (e.g. "Friday, Jul 3, 2026")
  const currentFormattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-[#D8D8D8] px-6 py-3 flex items-center justify-between">
      {/* Search & Greeting / Left Action Row */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-[#E5E3E7]/50 text-[#2F2F2F] cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar Placeholder */}
        <div className="relative max-w-xs w-full hidden sm:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#666666]/75">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search leads, tasks, activity logs..."
            className="w-full text-xs bg-[#E5E3E7]/25 border border-[#D8D8D8] rounded-lg pl-9 pr-4 py-2 text-[#2F2F2F] placeholder-[#666666]/60 focus:outline-none focus:border-[#4E4E49] focus:ring-1 focus:ring-[#4E4E49] transition-all"
          />
        </div>
        
        {/* Current Date & Greeting display */}
        <div className="hidden lg:flex flex-col items-start gap-0.5 border-l border-[#D8D8D8] pl-4 text-left">
          <span className="text-sm font-bold text-[#2F2F2F] font-display tracking-tight">
            {greeting}, {user?.name || "Saksham"} 👋
          </span>
          <span className="text-[10px] text-[#666666] font-mono font-medium">
            {currentFormattedDate}
          </span>
        </div>
      </div>

      {/* Utilities / Right Action Row */}
      <div className="flex items-center gap-3.5">
        
        {/* Quick action: + Lead */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenNewLeadModal}
          icon={<Plus size={15} />}
        >
          New Lead
        </Button>

        {/* Notifications Popover Control */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2.5 rounded-full hover:bg-[#E5E3E7]/50 text-[#60605B] hover:text-[#2F2F2F] transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#4E4E49]/30"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-[#8CB9D7] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications List Overlay */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 bg-white border border-[#D8D8D8] rounded-xl shadow-lg z-50 overflow-hidden flex flex-col"
                >
                  <div className="px-4 py-3.5 border-b border-[#D8D8D8] bg-gray-50/50 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#2F2F2F]">Notifications</h4>
                      <p className="text-[10px] text-[#666666]">{unreadCount} unread action items</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-[#4E4E49] hover:text-[#8CB9D7] font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Check size={11} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                    {activeNotifs.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#666666]">
                        No active notifications. All clean!
                      </div>
                    ) : (
                      activeNotifs.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3.5 text-left transition-all ${
                            notif.isRead ? "bg-white" : "bg-[#8CB9D7]/5"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[11px] font-bold text-[#2F2F2F] flex items-center gap-1">
                              {notif.type.includes("AI") && (
                                <Sparkles size={11} className="text-[#8CB9D7] shrink-0" />
                              )}
                              {notif.priority === "CRITICAL" && (
                                <ShieldAlert size={11} className="text-amber-500 shrink-0" />
                              )}
                              {notif.title}
                            </span>
                            <button
                              onClick={() => handleClearNotif(notif.id)}
                              className="text-[10px] text-[#666666]/60 hover:text-red-500 font-bold px-1 cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                          <p className="text-[10px] text-[#666666] mt-1 leading-snug">
                            {notif.description}
                          </p>
                          <span className="text-[9px] text-[#666666]/50 mt-1.5 block font-mono">
                            {formatDateTime(notif.timestamp)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-[#D8D8D8] bg-gray-50/50 text-center flex flex-col gap-1.5">
                    {onChangeTab && (
                      <button
                        onClick={() => {
                          onChangeTab("notifications");
                          setShowNotifications(false);
                        }}
                        className="text-[10px] font-extrabold text-purple-700 hover:underline cursor-pointer py-1 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-lg transition-all"
                      >
                        Open Notifications Cockpit
                      </button>
                    )}
                    <span className="text-[8px] font-bold text-gray-400 tracking-wider uppercase">
                      Synity Proactive Sales OS
                    </span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-[#E5E3E7]/50 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-[#4E4E49]/30"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full object-cover border border-[#D8D8D8]"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[#8CB9D7]/15 text-[#3b7194] border border-[#8CB9D7]/30 flex items-center justify-center text-xs font-bold uppercase">
                {user?.name ? user.name.slice(0, 2) : "SK"}
              </div>
            )}
          </button>

          {/* Profile Dropdown List Overlay */}
          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-[#D8D8D8] rounded-xl shadow-lg z-50 overflow-hidden flex flex-col"
                >
                  {/* Profile Detail Header */}
                  <div className="p-4 border-b border-gray-100 bg-gray-50/40 text-left">
                    <p className="text-xs font-bold text-[#2F2F2F] truncate">
                      {user?.name || "Saksham"}
                    </p>
                    <p className="text-[10px] text-[#666666] truncate mt-0.5">
                      {user?.email || "saksham@synity.io"}
                    </p>
                    <span className="inline-flex items-center mt-2 px-1.5 py-0.5 rounded-md bg-[#8CB9D7]/10 border border-[#8CB9D7]/25 text-[9px] font-semibold text-[#3b7194] uppercase font-mono">
                      {user?.role || "Senior Partner"}
                    </span>
                  </div>

                  {/* Settings and Info Actions */}
                  <div className="p-1.5 flex flex-col gap-0.5">
                    <div className="px-2.5 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-left">
                      Sales OS Admin
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Redirect/Action can be simulated or let standard UI handle
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-[#4E4E49] hover:bg-gray-50 rounded-lg text-left transition-all"
                    >
                      <User size={14} className="text-gray-400" />
                      <span>User Profile Settings</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-[#4E4E49] hover:bg-gray-50 rounded-lg text-left transition-all"
                    >
                      <Settings size={14} className="text-gray-400" />
                      <span>Workspace Config</span>
                    </button>
                  </div>

                  {/* Logout Action */}
                  <div className="p-1.5 border-t border-gray-100 bg-gray-50/10">
                    <button
                      onClick={async () => {
                        setShowProfileMenu(false);
                        await logout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left transition-all font-semibold"
                    >
                      <LogOut size={14} />
                      <span>Sign Out Account</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

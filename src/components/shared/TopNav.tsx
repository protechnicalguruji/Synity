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
  ShieldAlert
} from "lucide-react";
import { Button } from "../ui/Button";
import { MOCK_NOTIFICATIONS } from "../../constants";
import { formatDateTime } from "../../utils";
import { motion, AnimatePresence } from "motion/react";

export interface TopNavProps {
  onOpenMobileSidebar: () => void;
  onOpenNewLeadModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenMobileSidebar,
  onOpenNewLeadModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotif = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-[#D8D8D8] px-6 py-3 flex items-center justify-between">
      {/* Search / Left Action Row */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-[#E5E3E7]/50 text-[#2F2F2F] cursor-pointer"
        >
          <Menu size={20} />
        </button>

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
        
        {/* Local time badge for context */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-md text-[11px] font-mono text-[#666666]">
          <Clock size={11} />
          <span>Jul 3, 11:29 AM</span>
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
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full hover:bg-[#E5E3E7]/50 text-[#60605B] hover:text-[#2F2F2F] transition-all cursor-pointer outline-none focus:ring-2 focus:ring-primary-accent"
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
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#666666]">
                        No active notifications. All clean!
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3.5 text-left transition-all ${
                            notif.read ? "bg-white" : "bg-[#8CB9D7]/5"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[11px] font-bold text-[#2F2F2F] flex items-center gap-1">
                              {notif.type === "AI_INSIGHT" && (
                                <Sparkles size={11} className="text-[#8CB9D7] shrink-0" />
                              )}
                              {notif.type === "FOLLOW_UP" && (
                                <ShieldAlert size={11} className="text-amber-500 shrink-0" />
                              )}
                              {notif.title}
                            </span>
                            <button
                              onClick={() => handleClearNotif(notif.id)}
                              className="text-[10px] text-[#666666]/60 hover:text-red-500 font-bold px-1"
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
                  
                  <div className="px-4 py-2 border-t border-[#D8D8D8] bg-gray-50/50 text-center">
                    <span className="text-[9px] font-bold text-[#666666] tracking-wider uppercase">
                      Synity Proactive Sales OS
                    </span>
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

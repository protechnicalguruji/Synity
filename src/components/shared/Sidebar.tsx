/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  LayoutDashboard,
  Users,
  Kanban,
  CheckSquare,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LogOut,
  ShieldCheck,
  Menu
} from "lucide-react";
import { cn } from "../../utils";
import { useAuth } from "../../hooks/useAuth";

export interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onChangeTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { user, logout, isDemoMode } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = user ? getInitials(user.name) : "AR";

  const menuItems = [
    { id: "today", label: "AI Daily Planner", icon: <Sparkles size={18} />, badge: "AI" },
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "leads", label: "Leads Hub", icon: <Users size={18} />, badge: "6" },
    { id: "pipeline", label: "Visual Pipeline", icon: <Kanban size={18} /> },
    { id: "tasks", label: "Workday Tasks", icon: <CheckSquare size={18} />, badge: "4" },
    { id: "analytics", label: "Analytics & ROI", icon: <BarChart3 size={18} /> },
    { id: "settings", label: "System Settings", icon: <Settings size={18} /> },
  ];

  const handleItemClick = (id: string) => {
    onChangeTab(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-[#D8D8D8]">
      {/* Brand & Logo Header */}
      <div>
        <div className="px-6 py-5 border-b border-[#D8D8D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#4E4E49] flex items-center justify-center text-white shadow-sm font-display font-bold text-lg">
              S
            </div>
            {!isCollapsed && (
              <span className="font-display font-bold text-xl tracking-tight text-[#2F2F2F]">
                Synity
              </span>
            )}
          </div>
          
          {/* Collapse toggle buttons (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-[#E5E3E7]/50 text-[#666666] hover:text-[#2F2F2F] transition-all cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* AI Sales Operating Tagline / Accent */}
        {!isCollapsed && (
          <div className="mx-4 mt-4 px-4 py-3 rounded-xl bg-gradient-to-tr from-[#E5E3E7]/40 to-[#8CB9D7]/10 border border-[#D8D8D8]/60 flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#8CB9D7]/20 text-[#3b7194]">
              <Sparkles size={14} className="animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[#60605B] uppercase">AI COPILOT</p>
              <p className="text-[11px] text-[#2F2F2F] font-medium leading-none mt-0.5">Active & Calibrated</p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-3 text-sm font-medium rounded-lg transition-all cursor-pointer text-left group",
                  isActive
                    ? "bg-[#E5E3E7] text-[#2F2F2F]"
                    : "text-[#666666] hover:bg-[#E5E3E7]/35 hover:text-[#2F2F2F]"
                )}
              >
                <span className={cn(
                  "transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-[#4E4E49]" : "text-[#666666]"
                )}>
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                
                {!isCollapsed && item.badge && (
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    isActive ? "bg-white text-[#2F2F2F]" : "bg-[#E5E3E7] text-[#666666]"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile block */}
      <div className="border-t border-[#D8D8D8] p-4 bg-gray-50/50">
        <div className={cn(
          "flex items-center gap-3 rounded-xl p-2 hover:bg-[#E5E3E7]/40 transition-all",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#4E4E49] to-[#8CB9D7] flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#2F2F2F] truncate">{user?.name || "Sales Partner"}</p>
                <p className="text-[10px] text-[#666666] truncate font-mono">
                  {isDemoMode ? "Demo Sandbox" : (user?.role || "Sales Executive")}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => logout()}
              className="p-1 rounded-md text-gray-400 hover:text-red-600 transition-all cursor-pointer"
              title="Sign out of system"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:block h-screen shrink-0 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar drawer overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden bg-[#4E4E49]/35 backdrop-blur-xs transition-opacity duration-300",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onCloseMobile}
      >
        <div
          className={cn(
            "h-full w-64 bg-white transition-transform duration-300 ease-in-out transform shadow-xl",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

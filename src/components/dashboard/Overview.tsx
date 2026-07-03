/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  UserCheck
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Lead, Task, ActivityLog } from "../../types";
import { formatCurrency, formatDate } from "../../utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface OverviewProps {
  leads: Lead[];
  tasks: Task[];
  activities: ActivityLog[];
  onChangeTab: (tab: string) => void;
}

const ANALYTICS_DATA = [
  { name: "Jan", outbound: 45, won: 12000 },
  { name: "Feb", outbound: 60, won: 18000 },
  { name: "Mar", outbound: 95, won: 32000 },
  { name: "Apr", outbound: 120, won: 45000 },
  { name: "May", outbound: 155, won: 65000 },
  { name: "Jun", outbound: 180, won: 82000 },
  { name: "Jul", outbound: 210, won: 102500 }
];

export const Overview: React.FC<OverviewProps> = ({
  leads,
  tasks,
  activities,
  onChangeTab,
}) => {
  // Compute Key Metrics
  const totalPipeline = leads.reduce((sum, lead) => sum + lead.value, 0);
  const activeLeadsCount = leads.filter((l) => l.status !== "CLOSED_WON" && l.status !== "CLOSED_LOST").length;
  const closedWonRevenue = leads
    .filter((l) => l.status === "CLOSED_WON")
    .reduce((sum, l) => sum + l.value, 0);
  const openTasksCount = tasks.filter((t) => t.status !== "DONE").length;

  const urgentTasks = tasks
    .filter((t) => t.status !== "DONE")
    .slice(0, 3);

  const getLogIcon = (type: string) => {
    switch (type) {
      case "CALL":
        return <Phone size={13} className="text-blue-500" />;
      case "EMAIL":
        return <Mail size={13} className="text-purple-500" />;
      case "STATE_CHANGE":
        return <UserCheck size={13} className="text-emerald-500" />;
      default:
        return <Sparkles size={13} className="text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#D8D8D8] rounded-2xl p-6 shadow-2xs">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#2F2F2F] font-display tracking-tight flex items-center gap-2">
            Welcome back, Alex <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-[#666666] leading-relaxed">
            Your pipeline has grown by <span className="font-semibold text-emerald-600">+14%</span> this week. You have <span className="font-semibold text-[#2F2F2F]">{openTasksCount} active tasks</span> scheduled for today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#8CB9D7]/10 border border-[#8CB9D7]/30 rounded-xl px-4 py-2 text-xs text-[#3b7194] font-medium">
          <Sparkles size={14} className="animate-pulse" />
          <span>AI Insight: Kenji Sato has finished contract review. Tap to view negotiation terms.</span>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="py-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#666666] tracking-tight uppercase">Closed revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={16} /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#2F2F2F] font-display">{formatCurrency(closedWonRevenue)}</h3>
            <span className="text-[10px] text-emerald-600 font-bold tracking-wide">100% of monthly quota met</span>
          </div>
        </Card>

        <Card className="py-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#666666] tracking-tight uppercase">Active pipeline</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={16} /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#2F2F2F] font-display">{formatCurrency(totalPipeline)}</h3>
            <span className="text-[10px] text-blue-600 font-bold tracking-wide">6 active leads in negotiation</span>
          </div>
        </Card>

        <Card className="py-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#666666] tracking-tight uppercase">My Leads Hub</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={16} /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#2F2F2F] font-display">{activeLeadsCount} leads</h3>
            <span className="text-[10px] text-purple-600 font-bold tracking-wide">2 inbound registrations today</span>
          </div>
        </Card>

        <Card className="py-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#666666] tracking-tight uppercase">Workday Tasks</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><CheckCircle2 size={16} /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-[#2F2F2F] font-display">{openTasksCount} pending</h3>
            <span className="text-[10px] text-amber-600 font-bold tracking-wide">2 marked high priority</span>
          </div>
        </Card>
      </div>

      {/* Main Content Area split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Analytics Trend Panel */}
        <div className="lg:col-span-2">
          <Card
            title="Revenue & Engagement Trends"
            description="Comparison of outbound campaigns against closed-won annual revenue metrics."
            headerActions={
              <Button variant="outline" size="xs" onClick={() => onChangeTab("analytics")}>
                Full Report <ArrowRight size={12} className="ml-1" />
              </Button>
            }
          >
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8CB9D7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8CB9D7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#666666" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666666" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #D8D8D8", fontSize: "11px" }}
                  />
                  <Area type="monotone" dataKey="won" name="Revenue Won ($)" stroke="#4E4E49" strokeWidth={2} fillOpacity={1} fill="url(#colorWon)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Action center side-rail (Pending Tasks & Activity Stream) */}
        <div className="space-y-6">
          
          {/* Quick Tasks */}
          <Card
            title="Workday Alerts"
            description="Tasks that need immediate attention."
            headerActions={
              <Button variant="ghost" size="xs" onClick={() => onChangeTab("tasks")}>
                View all
              </Button>
            }
          >
            <div className="space-y-3.5 mt-3">
              {urgentTasks.length === 0 ? (
                <div className="text-center text-xs text-gray-500 py-4">No pending actions today. Nice!</div>
              ) : (
                urgentTasks.map((t) => (
                  <div key={t.id} className="p-3 bg-gray-50/55 hover:bg-gray-50 border border-gray-100 rounded-lg flex items-start gap-3 transition-all">
                    <input
                      type="checkbox"
                      className="mt-0.5 rounded border-[#D8D8D8] text-[#4E4E49] focus:ring-[#8CB9D7]"
                      checked={t.status === "DONE"}
                      readOnly
                    />
                    <div className="space-y-0.5 text-left min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#2F2F2F] truncate">{t.title}</p>
                      {t.leadName && (
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                          Lead: <span className="font-medium text-[#4E4E49]">{t.leadName}</span>
                        </p>
                      )}
                    </div>
                    <Badge variant={t.priority === "HIGH" ? "danger" : "warning"} size="sm" className="shrink-0">
                      {t.priority}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Activity Logs Stream */}
          <Card
            title="Recent Activity Feed"
            description="Live record of agency outreach."
          >
            <div className="space-y-4 mt-3">
              {activities.slice(0, 3).map((act) => (
                <div key={act.id} className="flex gap-3 text-left">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-[#E5E3E7] flex items-center justify-center shrink-0 border border-gray-100">
                    {getLogIcon(act.type)}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#2F2F2F] leading-snug">{act.title}</p>
                    <p className="text-[11px] text-gray-500 leading-normal line-clamp-2">{act.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-mono text-[#666666]/50">{formatDate(act.timestamp)}</span>
                      <span className="text-[9px] text-[#666666]/60">•</span>
                      <span className="text-[9px] font-medium text-[#666666]/60">{act.userName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

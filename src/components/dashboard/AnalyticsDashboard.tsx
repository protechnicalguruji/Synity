/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  X,
  Plus
} from "lucide-react";
import { Lead } from "../../types";
import { DateFilterType } from "../../types/analytics";
import { formatCurrency } from "../../utils";

// Analytics Components
import { KPICard } from "../analytics/KPICard";
import { RevenueCard } from "../analytics/RevenueCard";
import { FunnelChart } from "../analytics/FunnelChart";
import { PipelineChart } from "../analytics/PipelineChart";
import { PerformanceChart } from "../analytics/PerformanceChart";
import { IndustryChart } from "../analytics/IndustryChart";
import { CountryChart } from "../analytics/CountryChart";
import { GoalCard } from "../analytics/GoalCard";
import { ForecastCard } from "../analytics/ForecastCard";
import { InsightCard } from "../analytics/InsightCard";
import { ReportCard } from "../analytics/ReportCard";
import { LossAnalyticsCard } from "../analytics/LossAnalyticsCard";
import { TimeAnalyticsCard } from "../analytics/TimeAnalyticsCard";
import { ProductivityCard } from "../analytics/ProductivityCard";
import { FollowupAnalyticsCard } from "../analytics/FollowupAnalyticsCard";

// Helpers
import {
  filterLeadsByDate,
  calculateKPIs,
  calculateFunnel,
  calculatePipelineValue,
  calculatePerformance,
  calculateTimeStats,
  calculateLeadSources,
  calculateIndustryStats,
  calculateCountryStats,
  calculateLossStats,
  calculateFollowups,
  calculateProductivity,
  calculateForecast,
  calculateGoalProgress,
  generateInsights
} from "../../utils/analyticsHelpers";

interface AnalyticsDashboardProps {
  leads: Lead[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ leads }) => {
  const [filter, setFilter] = useState<DateFilterType>("LAST_30_DAYS");
  const [customRange, setCustomRange] = useState({ start: "2026-06-01", end: "2026-07-05" });
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize lead filtering to prevent redundant heavy recalculations
  const filteredLeads = useMemo(() => {
    let base = filterLeadsByDate(leads, filter, customRange);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          (l.industry && l.industry.toLowerCase().includes(q)) ||
          (l.country && l.country.toLowerCase().includes(q))
      );
    }
    return base;
  }, [leads, filter, customRange, searchQuery]);

  // Memoize all analytics calculation results for pristine performance
  const metrics = useMemo(() => {
    return calculateKPIs(filteredLeads);
  }, [filteredLeads]);

  const funnelData = useMemo(() => {
    return calculateFunnel(filteredLeads);
  }, [filteredLeads]);

  const pipelineRevenue = useMemo(() => {
    return calculatePipelineValue(filteredLeads);
  }, [filteredLeads]);

  const performanceStats = useMemo(() => {
    return calculatePerformance(filteredLeads);
  }, [filteredLeads]);

  const timeStats = useMemo(() => {
    return calculateTimeStats(filteredLeads);
  }, [filteredLeads]);

  const leadSources = useMemo(() => {
    return calculateLeadSources(filteredLeads);
  }, [filteredLeads]);

  const industryStats = useMemo(() => {
    return calculateIndustryStats(filteredLeads);
  }, [filteredLeads]);

  const countryStats = useMemo(() => {
    return calculateCountryStats(filteredLeads);
  }, [filteredLeads]);

  const lossStats = useMemo(() => {
    return calculateLossStats(filteredLeads);
  }, [filteredLeads]);

  const followupStats = useMemo(() => {
    return calculateFollowups(filteredLeads);
  }, [filteredLeads]);

  const productivityStats = useMemo(() => {
    return calculateProductivity(filteredLeads);
  }, [filteredLeads]);

  const forecast = useMemo(() => {
    return calculateForecast(filteredLeads);
  }, [filteredLeads]);

  const goals = useMemo(() => {
    return calculateGoalProgress(filteredLeads);
  }, [filteredLeads]);

  const insights = useMemo(() => {
    return generateInsights(filteredLeads);
  }, [filteredLeads]);

  // Simulate loader behavior
  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const triggerErrorSimulation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasError(true);
    }, 800);
  };

  // Keyboard navigation helpers
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-4" aria-label="Sales intelligence and Analytics Portal">
      {/* Top action/header panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left space-y-0.5">
          <h1 className="text-2xl font-black font-display text-gray-900 tracking-tight flex items-center gap-2">
            Synity Corporate Intelligence
            <Sparkles size={20} className="text-purple-600 animate-pulse shrink-0" />
          </h1>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            Real-time sales velocity metrics, B2B industry yields, and SLA forecasting engine
          </p>
        </div>

        {/* Diagnostic Actions */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Dashboard Utility Controls">
          <button
            onClick={handleReload}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 hover:border-purple-400 bg-white hover:bg-gray-50 active:bg-gray-100 text-[#2F2F2F] text-[10px] font-extrabold uppercase rounded-xl transition-all shadow-3xs cursor-pointer focus:ring-2 focus:ring-purple-400 focus:outline-none"
            aria-label="Reload and refresh metrics"
          >
            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            <span>Sync Live Feed</span>
          </button>

          <button
            onClick={triggerErrorSimulation}
            className="flex items-center gap-1.5 px-3 py-2 border border-rose-200 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-50 active:bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase rounded-xl transition-all shadow-3xs cursor-pointer focus:ring-2 focus:ring-rose-400 focus:outline-none"
            aria-label="Simulate connection timeout error"
          >
            <AlertTriangle size={12} />
            <span>Simulate SLA Timeout</span>
          </button>
        </div>
      </div>

      {/* Control row with Date range filters & search bar */}
      <div className="bg-[#FAF9FC] border border-[#EBEBEB] rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Date Filter selector */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto" role="radiogroup" aria-label="Select report date range">
          {(["TODAY", "YESTERDAY", "LAST_7_DAYS", "LAST_30_DAYS", "LAST_90_DAYS", "THIS_MONTH", "LAST_MONTH", "CUSTOM"] as DateFilterType[]).map((d) => {
            const isActive = filter === d;
            const labelMap: Record<DateFilterType, string> = {
              TODAY: "Today",
              YESTERDAY: "Yesterday",
              LAST_7_DAYS: "7 Days",
              LAST_30_DAYS: "30 Days",
              LAST_90_DAYS: "90 Days",
              THIS_MONTH: "This Month",
              LAST_MONTH: "Last Month",
              CUSTOM: "Custom Range"
            };

            return (
              <button
                key={d}
                onClick={() => {
                  setFilter(d);
                  if (d === "CUSTOM") {
                    setShowCustomPicker(true);
                  } else {
                    setShowCustomPicker(false);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#2F2F2F] text-white border-transparent"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
                role="radio"
                aria-checked={isActive}
              >
                {labelMap[d]}
              </button>
            );
          })}
        </div>

        {/* Search bar inside dashboard */}
        <div className="relative w-full lg:w-64">
          <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 my-auto" size={13} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search country, industry..."
            className="w-full bg-white border border-[#D8D8D8] text-xs rounded-xl pl-8 pr-3 py-2 font-medium focus:outline-none focus:border-purple-400 placeholder-gray-400"
            aria-label="Search segments in dashboard"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              aria-label="Clear search query"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Custom Picker Panel */}
      {showCustomPicker && (
        <div className="bg-[#FAF9FC] border border-[#EBEBEB] rounded-2xl p-4 text-left grid grid-cols-1 sm:grid-cols-3 gap-4 items-end animate-fadeIn">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Start Date</label>
            <input
              type="date"
              value={customRange.start}
              onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
              className="w-full bg-white border border-gray-200 text-xs rounded-lg p-2 font-bold text-gray-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">End Date</label>
            <input
              type="date"
              value={customRange.end}
              onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
              className="w-full bg-white border border-gray-200 text-xs rounded-lg p-2 font-bold text-gray-700"
            />
          </div>

          <button
            onClick={() => {
              setFilter("CUSTOM");
              setShowCustomPicker(false);
            }}
            className="w-full bg-[#2F2F2F] hover:bg-[#1A1A1A] text-white text-[10px] font-black uppercase py-2.5 rounded-lg cursor-pointer transition-all text-center"
          >
            Apply Range
          </button>
        </div>
      )}

      {/* ERROR SIMULATION UI */}
      {hasError && (
        <div
          className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle size={36} className="text-rose-600 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h2 className="text-base font-black font-display text-rose-900 uppercase">
              Corporate Feed Sync Timeout (SLA-504)
            </h2>
            <p className="text-xs text-rose-700/85 font-medium leading-relaxed">
              We were unable to securely sync your distributed analytics workspace. This is usually caused by momentary network fluctuations on secondary API ingest queues.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleReload}
              onKeyDown={(e) => handleKeyDown(e, handleReload)}
              className="bg-rose-700 hover:bg-rose-800 text-white text-[10px] font-black uppercase px-6 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all focus:ring-2 focus:ring-rose-500"
              tabIndex={0}
            >
              Re-establish Connection
            </button>
            <button
              onClick={() => setHasError(false)}
              className="border border-rose-300 bg-white text-rose-700 hover:bg-rose-50 text-[10px] font-black uppercase px-6 py-2.5 rounded-xl cursor-pointer transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* SKELETON LOADING VIEW */}
      {isLoading && (
        <div className="space-y-6" aria-busy="true" aria-label="Loading analytics workspace">
          {/* KPI grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-[#D8D8D8] rounded-2xl p-4 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2.5 bg-gray-200 rounded w-16" />
                    <div className="h-5 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Large sections skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-[#D8D8D8] rounded-2xl p-5 h-72 animate-pulse space-y-4">
                <div className="space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded w-40" />
                  <div className="h-2 bg-gray-200 rounded w-56" />
                </div>
                <div className="h-44 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE */}
      {!isLoading && !hasError && (
        <div className="space-y-6">
          {/* KPI GRID PANEL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" role="grid" aria-label="Key Performance Indicators Grid">
            <KPICard
              label="Total Opportunities"
              value={metrics.totalLeads}
              trend={{ value: 12, isPositive: true }}
              iconBg="bg-indigo-50 text-indigo-700"
              icon={<Search size={16} />}
              id="kpi-total-leads"
            />
            <KPICard
              label="Active Pipeline"
              value={metrics.activeLeads}
              trend={{ value: 4, isPositive: true }}
              iconBg="bg-purple-50 text-purple-700"
              icon={<TrendingUp size={16} />}
              id="kpi-active-leads"
            />
            <KPICard
              label="Deals Won Signature"
              value={metrics.dealsClosed}
              trend={{ value: 18, isPositive: true }}
              iconBg="bg-emerald-50 text-emerald-700"
              icon={<CheckCircle size={16} />}
              id="kpi-deals-closed"
            />
            <KPICard
              label="Realized Conversion"
              value={`${metrics.conversionRate}%`}
              trend={{ value: 2, isPositive: true }}
              iconBg="bg-blue-50 text-blue-700"
              icon={<Sparkles size={16} />}
              id="kpi-conversion-rate"
            />
          </div>

          {/* SECOND ROW: REVENUE POOL & TIME ANALYTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueCard
              closedRevenue={pipelineRevenue.closed}
              pipelineRevenue={pipelineRevenue.pipeline}
              expectedRevenue={pipelineRevenue.expected}
              atRiskRevenue={pipelineRevenue.atRisk}
            />
            <TimeAnalyticsCard stats={timeStats} />
          </div>

          {/* THIRD ROW: FUNNEL WATERFALL & PIPELINE SEGMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FunnelChart data={funnelData} />
            <PipelineChart data={pipelineRevenue} />
          </div>

          {/* FOURTH ROW: PERFORMANCE ACTIVITIES & PRODUCTIVITY STREAKS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart stats={performanceStats} />
            <ProductivityCard stats={productivityStats} />
          </div>

          {/* FIFTH ROW: INDUSTRY SEGMENTS & GEOGRAPHIC DONUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IndustryChart data={industryStats} />
            <CountryChart data={countryStats} />
          </div>

          {/* SIXTH ROW: FOLLOW-UPS & LOSS ANALYSIS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FollowupAnalyticsCard stats={followupStats} />
            <LossAnalyticsCard stats={lossStats} />
          </div>

          {/* SEVENTH ROW: REVENUE FORECAST & GOAL MILESTONES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ForecastCard forecast={forecast} />
            <GoalCard goals={goals} />
          </div>

          {/* COGNITIVE AI INSIGHTS BAR */}
          <InsightCard insights={insights} />

          {/* REPORT EXPORTS & DISPATCH SCHEDULER */}
          <ReportCard leads={leads} />
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

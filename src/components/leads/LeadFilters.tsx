import React, { useState } from "react";
import { Filter, X, SlidersHorizontal, Calendar, DollarSign } from "lucide-react";
import { Lead, LeadStatus } from "../../types";

export interface FilterState {
  status: string;
  priority: string;
  industry: string;
  country: string;
  source: string;
  createdPreset: string;
  lastContactPreset: string;
  nextFollowUpPreset: string;
  minValue: string;
  maxValue: string;
}

export const initialFilterState: FilterState = {
  status: "ALL",
  priority: "ALL",
  industry: "ALL",
  country: "ALL",
  source: "ALL",
  createdPreset: "ALL",
  lastContactPreset: "ALL",
  nextFollowUpPreset: "ALL",
  minValue: "",
  maxValue: ""
};

interface LeadFiltersProps {
  leads: Lead[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  leads,
  filters,
  onFilterChange,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Dynamically extract unique values
  const uniqueIndustries = Array.from(new Set(leads.map((l) => l.industry).filter(Boolean))) as string[];
  const uniqueCountries = Array.from(new Set(leads.map((l) => l.country).filter(Boolean))) as string[];
  const uniqueSources = Array.from(new Set(leads.map((l) => l.source).filter(Boolean))) as string[];

  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status !== "ALL") count++;
    if (filters.priority !== "ALL") count++;
    if (filters.industry !== "ALL") count++;
    if (filters.country !== "ALL") count++;
    if (filters.source !== "ALL") count++;
    if (filters.createdPreset !== "ALL") count++;
    if (filters.lastContactPreset !== "ALL") count++;
    if (filters.nextFollowUpPreset !== "ALL") count++;
    if (filters.minValue !== "") count++;
    if (filters.maxValue !== "") count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
            activeCount > 0 || isOpen
              ? "bg-[#4E4E49] text-white border-[#4E4E49] shadow-xs"
              : "bg-white text-[#2F2F2F] border-[#D8D8D8] hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Advanced Filters</span>
          {activeCount > 0 && (
            <span className="flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold bg-[#8CB9D7] text-white animate-fade-in">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#666666] hover:text-[#2F2F2F] transition-colors"
          >
            <X size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="p-5 bg-white border border-[#D8D8D8] rounded-xl shadow-xs grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-down text-left">
          {/* Status */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">Lead Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(LeadStatus).map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Industry */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">Industry</label>
            <select
              value={filters.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
            >
              <option value="ALL">All Industries</option>
              {uniqueIndustries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">Country</label>
            <select
              value={filters.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
            >
              <option value="ALL">All Countries</option>
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">Acquisition Source</label>
            <select
              value={filters.source}
              onChange={(e) => handleChange("source", e.target.value)}
              className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
            >
              <option value="ALL">All Sources</option>
              {uniqueSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          {/* Created Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
              <Calendar size={11} /> Created On
            </label>
            <select
              value={filters.createdPreset}
              onChange={(e) => handleChange("createdPreset", e.target.value)}
              className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
            >
              <option value="ALL">Any Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">This Week</option>
              <option value="MONTH">This Month</option>
              <option value="DAYS30">Last 30 Days</option>
            </select>
          </div>

          {/* Next Follow Up */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
              <Calendar size={11} /> Next Follow Up
            </label>
            <select
              value={filters.nextFollowUpPreset}
              onChange={(e) => handleChange("nextFollowUpPreset", e.target.value)}
              className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
            >
              <option value="ALL">Any Time</option>
              <option value="TODAY">Today</option>
              <option value="TOMORROW">Tomorrow</option>
              <option value="WEEK">Next 7 Days</option>
              <option value="OVERDUE">Overdue Only</option>
            </select>
          </div>

          {/* Deal Value Min/Max */}
          <div className="space-y-1 md:col-span-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1">
              <DollarSign size={11} /> Est. Deal Value Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={filters.minValue}
                onChange={(e) => handleChange("minValue", e.target.value)}
                className="w-1/2 text-xs bg-white border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxValue}
                onChange={(e) => handleChange("maxValue", e.target.value)}
                className="w-1/2 text-xs bg-white border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 text-[#2F2F2F] outline-none focus:border-[#4E4E49]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

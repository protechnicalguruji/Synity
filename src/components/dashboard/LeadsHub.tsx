/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Filter,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Phone,
  Mail,
  MoreVertical,
  Calendar,
  AlertCircle,
  Eye,
  Trash2,
  Building
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { EmptyState } from "../ui/EmptyState";
import { Lead, LeadStatus } from "../../types";
import { formatCurrency, formatDate, getStatusStyle, getConfidenceColor } from "../../utils";
import { Modal } from "../ui/Modal";

interface LeadsHubProps {
  leads: Lead[];
  onUpdateLeadStatus: (id: string, status: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  onOpenNewLeadModal: () => void;
}

export const LeadsHub: React.FC<LeadsHubProps> = ({
  leads,
  onUpdateLeadStatus,
  onDeleteLead,
  onOpenNewLeadModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"name" | "value" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Selected lead for detail viewing
  const [inspectedLead, setInspectedLead] = useState<Lead | null>(null);

  // Extract unique sources for filtering options
  const uniqueSources = Array.from(new Set(leads.map((l) => l.source)));

  const handleToggleSort = (field: "name" | "value" | "createdAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Filter & Sort core logic
  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
      const matchesSource = sourceFilter === "ALL" || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "value") {
        comparison = a.value - b.value;
      } else if (sortBy === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const getSortIcon = (field: "name" | "value" | "createdAt") => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left space-y-0.5">
          <h2 className="text-xl font-bold font-display text-[#2F2F2F] tracking-tight">Active Leads Directory</h2>
          <p className="text-xs text-[#666666]">Store leads, track high propensity scores, and prevent missed follow-ups.</p>
        </div>
      </div>

      {/* Control Panel: Filters, Search, and Status dropdown */}
      <Card className="py-4 px-5">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Left: Search input */}
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search by lead name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
              className="py-2.5 text-xs"
            />
          </div>

          {/* Right: Dropdowns and Sort metrics */}
          <div className="flex flex-wrap gap-3 items-center">
            
            {/* Status Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#666666]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none focus:border-[#4E4E49] focus:ring-1 focus:ring-[#4E4E49]"
              >
                <option value="ALL">All Statuses</option>
                {Object.values(LeadStatus).map((st) => (
                  <option key={st} value={st}>
                    {st.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#666666]">Source:</span>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="text-xs bg-white border border-[#D8D8D8] rounded-lg px-3 py-2 text-[#2F2F2F] outline-none focus:border-[#4E4E49] focus:ring-1 focus:ring-[#4E4E49]"
              >
                <option value="ALL">All Sources</option>
                {uniqueSources.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Results Counter */}
            <span className="text-xs font-mono text-gray-500 bg-gray-100 border border-gray-200/50 px-2.5 py-1 rounded-md">
              {filteredLeads.length} leads found
            </span>

          </div>
        </div>
      </Card>

      {/* Directory Table View */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          title="No leads match your criteria"
          description="Try adjusting your filters, modifying search keywords, or register a new outbound lead."
          actionText="Create New Lead"
          onAction={onOpenNewLeadModal}
        />
      ) : (
        <div className="border border-[#D8D8D8] rounded-xl overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#D8D8D8] text-xs font-bold text-[#666666] uppercase tracking-wider">
                  <th className="py-4 px-6 cursor-pointer hover:bg-gray-100/60" onClick={() => handleToggleSort("name")}>
                    Lead & Company {getSortIcon("name")}
                  </th>
                  <th className="py-4 px-6 cursor-pointer hover:bg-gray-100/60" onClick={() => handleToggleSort("value")}>
                    Estimated Value {getSortIcon("value")}
                  </th>
                  <th className="py-4 px-6">Pipeline Status</th>
                  <th className="py-4 px-6">Confidence Score</th>
                  <th className="py-4 px-6 cursor-pointer hover:bg-gray-100/60" onClick={() => handleToggleSort("createdAt")}>
                    Created On {getSortIcon("createdAt")}
                  </th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D8D8] text-sm">
                {filteredLeads.map((lead) => {
                  const statusStyle = getStatusStyle(lead.status);
                  const confidence = getConfidenceColor(lead.confidenceScore);
                  
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                      {/* Name and Company */}
                      <td className="py-4.5 px-6">
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-[#2F2F2F] hover:text-[#4E4E49] cursor-pointer" onClick={() => setInspectedLead(lead)}>
                            {lead.name}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <Building size={11} /> {lead.company}
                          </span>
                        </div>
                      </td>

                      {/* Est value */}
                      <td className="py-4.5 px-6 font-semibold text-[#2F2F2F] font-mono">
                        {formatCurrency(lead.value)}
                      </td>

                      {/* Pipeline Status */}
                      <td className="py-4.5 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                          {statusStyle.label}
                        </span>
                      </td>

                      {/* AI Confidence */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${confidence.bg} ${confidence.text} ${confidence.border}`}>
                            <Sparkles size={11} className="shrink-0" />
                            {lead.confidenceScore}%
                          </span>
                        </div>
                      </td>

                      {/* Date Created */}
                      <td className="py-4.5 px-6 text-xs text-gray-500 font-mono">
                        {formatDate(lead.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="xs"
                            className="p-1 text-gray-500 hover:text-[#4E4E49]"
                            title="Inspect Lead"
                            onClick={() => setInspectedLead(lead)}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Delete Lead"
                            onClick={() => onDeleteLead(lead.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECT DETAIL MODAL */}
      <Modal
        isOpen={inspectedLead !== null}
        onClose={() => setInspectedLead(null)}
        title={inspectedLead ? `${inspectedLead.name} Details` : ""}
        size="md"
      >
        {inspectedLead && (
          <div className="space-y-6 text-left">
            {/* Header info */}
            <div className="flex justify-between items-start pb-4 border-b border-[#D8D8D8]">
              <div>
                <h4 className="text-base font-bold text-[#2F2F2F] font-display">{inspectedLead.name}</h4>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Building size={12} /> {inspectedLead.company}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-500 font-mono">Value</span>
                <p className="text-lg font-bold text-[#4E4E49] font-mono leading-none mt-1">
                  {formatCurrency(inspectedLead.value)}
                </p>
              </div>
            </div>

            {/* Quick stats columns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider">Pipeline Stage</span>
                <div className="mt-2">
                  <select
                    value={inspectedLead.status}
                    onChange={(e) => onUpdateLeadStatus(inspectedLead.id, e.target.value as LeadStatus)}
                    className="text-xs bg-white border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 font-semibold text-[#2F2F2F]"
                  >
                    {Object.values(LeadStatus).map((st) => (
                      <option key={st} value={st}>
                        {st.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider">AI Confidence</span>
                <div className="mt-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#8CB9D7]" />
                  <span className="text-sm font-bold text-[#2F2F2F] font-mono">{inspectedLead.confidenceScore}% close rate</span>
                </div>
              </div>
            </div>

            {/* Contact metrics */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#666666]">Contact Details</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 text-xs text-[#2F2F2F]">
                  <Mail size={14} className="text-gray-400 shrink-0" />
                  <a href={`mailto:${inspectedLead.email}`} className="hover:underline font-mono">{inspectedLead.email}</a>
                </div>
                {inspectedLead.phone && (
                  <div className="flex items-center gap-2.5 text-xs text-[#2F2F2F]">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span className="font-mono">{inspectedLead.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Follow up log */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#666666]">Next Scheduled Follow-up</h5>
                {inspectedLead.nextFollowUp && (
                  <Badge variant="accent" size="sm" className="font-mono">
                    {formatDate(inspectedLead.nextFollowUp)}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed bg-blue-50/20 border border-[#8CB9D7]/30 p-3 rounded-lg flex items-start gap-2">
                <Calendar size={13} className="text-[#8CB9D7] shrink-0 mt-0.5" />
                <span>The system has flagged this lead for touch-point follow-up next week to solidify the custom pricing details.</span>
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#666666]">Executive Sales Notes</h5>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs text-[#2F2F2F] leading-relaxed whitespace-pre-wrap">
                {inspectedLead.notes || "No custom notes written for this lead yet. Use notes to align teammates on contract specifics."}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#D8D8D8] flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setInspectedLead(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

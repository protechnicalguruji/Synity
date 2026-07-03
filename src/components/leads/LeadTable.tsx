import React, { useState } from "react";
import { Phone, Mail, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, Calendar, Building, Globe, MessageSquare } from "lucide-react";
import { Lead } from "../../types";
import { formatCurrency, formatDate, getConfidenceColor } from "../../utils";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "../ui/Button";

interface LeadTableProps {
  leads: Lead[];
  onOpenDetails: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  onOpenDetails,
  onEditLead,
  onDeleteLead
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(leads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = leads.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <div className="space-y-4">
      <div className="border border-[#D8D8D8] rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-gray-50 border-b border-[#D8D8D8] shadow-2xs">
              <tr className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                <th className="py-4 px-5 bg-gray-50">Business</th>
                <th className="py-4 px-5 bg-gray-50">Owner</th>
                <th className="py-4 px-5 bg-gray-50">Contact info</th>
                <th className="py-4 px-5 bg-gray-50">Status</th>
                <th className="py-4 px-5 bg-gray-50">Priority</th>
                <th className="py-4 px-5 bg-gray-50">Estimated Value</th>
                <th className="py-4 px-5 bg-gray-50">Next Follow Up</th>
                <th className="py-4 px-5 bg-gray-50">Last Contact</th>
                <th className="py-4 px-5 bg-gray-50">Created Date</th>
                <th className="py-4 px-5 text-right bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D8D8] text-xs">
              {paginatedLeads.map((lead) => {
                const confidence = getConfidenceColor(lead.confidenceScore);

                return (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                    {/* Business Name & Website */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col text-left">
                        <span
                          className="font-bold text-[#2F2F2F] hover:text-[#4E4E49] cursor-pointer text-sm"
                          onClick={() => onOpenDetails(lead)}
                        >
                          {lead.company}
                        </span>
                        {lead.website && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-gray-400">
                            <Globe size={11} />
                            <a
                              href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline hover:text-[#4E4E49]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {lead.website.replace(/^(https?:\/\/)?(www\.)?/, "")}
                            </a>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(lead.website || "", "Website");
                              }}
                              className="text-[10px] text-gray-400 hover:text-[#2F2F2F]"
                            >
                              (copy)
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Owner Name & Industry */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-[#2F2F2F]">{lead.name}</span>
                        {lead.industry && (
                          <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">
                            {lead.industry}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Phone, Email, WhatsApp */}
                    <td className="py-4 px-5">
                      <div className="space-y-1 text-left font-mono">
                        {lead.email && (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Mail size={11} className="shrink-0" />
                            <span
                              className="cursor-pointer hover:underline"
                              onClick={() => handleCopy(lead.email, "Email")}
                            >
                              {lead.email}
                            </span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Phone size={11} className="shrink-0" />
                            <span
                              className="cursor-pointer hover:underline"
                              onClick={() => handleCopy(lead.phone || "", "Phone")}
                            >
                              {lead.phone}
                            </span>
                          </div>
                        )}
                        {lead.whatsapp && (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <MessageSquare size={11} className="shrink-0" />
                            <span
                              className="cursor-pointer hover:underline"
                              onClick={() => handleCopy(lead.whatsapp || "", "WhatsApp")}
                            >
                              {lead.whatsapp} (WA)
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5">
                      <LeadStatusBadge status={lead.status} />
                    </td>

                    {/* Priority Badge */}
                    <td className="py-4 px-5">
                      <PriorityBadge priority={lead.priority} />
                    </td>

                    {/* Estimated value & Close confidence */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-sm text-[#2F2F2F] font-mono">
                          {formatCurrency(lead.value)}
                        </span>
                        <span className={`inline-flex items-center gap-1 w-max px-1.5 py-0.5 rounded text-[10px] font-bold border mt-0.5 ${confidence.bg} ${confidence.text} ${confidence.border}`}>
                          {lead.confidenceScore}% Close
                        </span>
                      </div>
                    </td>

                    {/* Next Follow Up */}
                    <td className="py-4 px-5 font-mono text-gray-500">
                      {lead.nextFollowUp ? (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-[#8CB9D7]" />
                          {formatDate(lead.nextFollowUp)}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>

                    {/* Last Contact */}
                    <td className="py-4 px-5 font-mono text-gray-500">
                      {lead.lastContactedAt ? formatDate(lead.lastContactedAt) : <span className="text-gray-300">-</span>}
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-5 font-mono text-gray-500">
                      {formatDate(lead.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          className="p-1.5 text-gray-500 hover:text-[#4E4E49] hover:bg-gray-100"
                          title="Open Details"
                          onClick={() => onOpenDetails(lead)}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="p-1.5 text-gray-500 hover:text-[#4E4E49] hover:bg-gray-100"
                          title="Edit Lead"
                          onClick={() => onEditLead(lead)}
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50/50"
                          title="Delete Lead"
                          onClick={() => onDeleteLead(lead)}
                        >
                          <Trash2 size={13} />
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

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-[#D8D8D8] rounded-xl">
          <span className="text-xs text-[#666666]">
            Showing <strong className="font-semibold text-[#2F2F2F]">{startIndex + 1}</strong> to{" "}
            <strong className="font-semibold text-[#2F2F2F]">
              {Math.min(startIndex + itemsPerPage, leads.length)}
            </strong>{" "}
            of <strong className="font-semibold text-[#2F2F2F]">{leads.length}</strong> entries
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="xs"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1.5"
            >
              <ChevronLeft size={14} />
            </Button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <Button
                key={idx}
                variant={currentPage === idx + 1 ? "primary" : "outline"}
                size="xs"
                onClick={() => handlePageChange(idx + 1)}
                className={`h-7 w-7 p-0 text-xs ${
                  currentPage === idx + 1 ? "bg-[#4E4E49] text-white" : ""
                }`}
              >
                {idx + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="xs"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1.5"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

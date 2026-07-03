import React from "react";
import { Phone, MessageSquare, Mail, Eye, Edit2, Trash2, Calendar, MapPin, Building, Globe, Sparkles } from "lucide-react";
import { Lead } from "../../types";
import { formatCurrency, getConfidenceColor } from "../../utils";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface LeadCardProps {
  lead: Lead;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onOpenDetails,
  onEdit,
  onDelete
}) => {
  const confidence = getConfidenceColor(lead.confidenceScore);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-[#D8D8D8] flex flex-col justify-between overflow-hidden relative group text-left">
      <div className="p-5 space-y-4">
        {/* Header: Company, country, edit/delete menu */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Building size={10} /> {lead.industry || "General Industry"}
            </span>
            <h4
              onClick={onOpenDetails}
              className="text-base font-bold text-[#2F2F2F] font-display tracking-tight cursor-pointer hover:text-[#4E4E49]"
            >
              {lead.company}
            </h4>
            {lead.country && (
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                <MapPin size={11} /> {lead.country}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="xs"
              className="p-1 text-gray-400 hover:text-[#2F2F2F] hover:bg-gray-100 rounded-lg"
              title="Edit"
              onClick={onEdit}
            >
              <Edit2 size={12} />
            </Button>
            <Button
              variant="ghost"
              size="xs"
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Delete"
              onClick={onDelete}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>

        {/* Badges strip */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <LeadStatusBadge status={lead.status} className="text-[10px]" />
          <PriorityBadge priority={lead.priority} className="text-[10px]" />
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${confidence.bg} ${confidence.text} ${confidence.border}`}>
            <Sparkles size={10} />
            {lead.confidenceScore}% close
          </span>
        </div>

        {/* Owner Name */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lead Owner</p>
            <p className="font-semibold text-[#2F2F2F] mt-0.5">{lead.name}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Est. Deal Value</p>
            <p className="font-bold text-[#2F2F2F] font-mono mt-0.5">{formatCurrency(lead.value)}</p>
          </div>
        </div>

        {/* Website & follow-up mini logs */}
        <div className="space-y-1.5 text-[11px] text-[#666666] pt-1">
          {lead.website && (
            <div className="flex items-center gap-1.5 font-mono">
              <Globe size={11} className="text-gray-400" />
              <span className="truncate max-w-[200px]">{lead.website}</span>
            </div>
          )}
          {lead.nextFollowUp && (
            <div className="flex items-center gap-1.5 text-blue-600 font-mono">
              <Calendar size={11} />
              <span>Next Touch: {new Date(lead.nextFollowUp).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Interactive Button bar */}
      <div className="bg-gray-50/50 border-t border-gray-100 px-5 py-3 flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="p-2 rounded-lg bg-white border border-[#D8D8D8] text-gray-500 hover:text-[#2F2F2F] hover:border-gray-300 hover:shadow-2xs transition-all"
              title="Call Phone"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={13} />
            </a>
          )}
          {lead.whatsapp && (
            <a
              href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-50 border border-emerald-200/50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 transition-all"
              title="Message WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageSquare size={13} />
            </a>
          )}
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="p-2 rounded-lg bg-white border border-[#D8D8D8] text-gray-500 hover:text-[#2F2F2F] hover:border-gray-300 hover:shadow-2xs transition-all"
              title="Send Email"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail size={13} />
            </a>
          )}
        </div>

        <Button
          size="xs"
          variant="outline"
          className="bg-white border-[#D8D8D8] text-xs font-semibold hover:bg-gray-50 flex items-center gap-1"
          onClick={onOpenDetails}
        >
          <Eye size={12} />
          Open Lead
        </Button>
      </div>
    </Card>
  );
};

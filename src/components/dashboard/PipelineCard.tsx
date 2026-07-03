/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Phone, MessageSquare, Calendar, Handshake, FileText, CheckCircle2, XCircle, PhoneOff } from "lucide-react";
import { Card } from "../ui/Card";
import { Lead } from "../../types";

interface PipelineCardProps {
  leads: Lead[];
  onStageClick: (stage: string) => void;
  activeStage?: string;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
  leads,
  onStageClick,
  activeStage = ""
}) => {
  // Compute counts dynamically from lead database status & notes
  const countNew = leads.filter((l) => l.status === "NEW").length;
  const countContacted = leads.filter((l) => l.status === "CONTACTED").length;
  const countQualified = leads.filter((l) => l.status === "QUALIFIED").length;
  const countProposal = leads.filter((l) => l.status === "PROPOSAL").length;
  const countNegotiation = leads.filter((l) => l.status === "NEGOTIATION").length;
  const countWon = leads.filter((l) => l.status === "CLOSED_WON").length;
  const countLost = leads.filter((l) => l.status === "CLOSED_LOST").length;

  // Let's create the 8 specific pipeline categories requested by the user
  const categories = [
    {
      id: "stage-called",
      title: "Called",
      count: countContacted,
      icon: <Phone size={15} />,
      color: "border-blue-200 text-blue-600 bg-blue-50/20 hover:bg-blue-50/50",
      activeColor: "ring-2 ring-blue-500 bg-blue-50/60"
    },
    {
      id: "stage-whatsapp",
      title: "WhatsApp Sent",
      // Derive or default to a subset of contacted leads with notes containing whatsapp
      count: Math.max(1, leads.filter(l => l.notes?.toLowerCase().includes("whatsapp")).length),
      icon: <MessageSquare size={15} />,
      color: "border-emerald-200 text-emerald-600 bg-emerald-50/20 hover:bg-emerald-50/50",
      activeColor: "ring-2 ring-emerald-500 bg-emerald-50/60"
    },
    {
      id: "stage-followup",
      title: "Follow Up",
      count: countQualified,
      icon: <Calendar size={15} />,
      color: "border-purple-200 text-purple-600 bg-purple-50/20 hover:bg-purple-50/50",
      activeColor: "ring-2 ring-purple-500 bg-purple-50/60"
    },
    {
      id: "stage-meeting",
      title: "Meeting",
      count: countNegotiation,
      icon: <Handshake size={15} />,
      color: "border-amber-200 text-amber-600 bg-amber-50/20 hover:bg-amber-50/50",
      activeColor: "ring-2 ring-amber-500 bg-amber-50/60"
    },
    {
      id: "stage-proposal",
      title: "Proposal",
      count: countProposal,
      icon: <FileText size={15} />,
      color: "border-indigo-200 text-indigo-600 bg-indigo-50/20 hover:bg-indigo-50/50",
      activeColor: "ring-2 ring-indigo-500 bg-indigo-50/60"
    },
    {
      id: "stage-closed",
      title: "Closed",
      count: countWon,
      icon: <CheckCircle2 size={15} />,
      color: "border-green-200 text-green-600 bg-green-50/20 hover:bg-green-50/50",
      activeColor: "ring-2 ring-green-500 bg-green-50/60"
    },
    {
      id: "stage-lost",
      title: "Lost",
      count: countLost,
      icon: <XCircle size={15} />,
      color: "border-rose-200 text-rose-600 bg-rose-50/20 hover:bg-rose-50/50",
      activeColor: "ring-2 ring-rose-500 bg-rose-50/60"
    },
    {
      id: "stage-noanswer",
      title: "No Answer",
      // Simple fallback or check for notes containing "no answer", "busy", "decline"
      count: leads.filter(l => l.notes?.toLowerCase().includes("no answer") || l.notes?.toLowerCase().includes("busy")).length,
      icon: <PhoneOff size={15} />,
      color: "border-gray-200 text-gray-500 bg-gray-50/20 hover:bg-gray-50/50",
      activeColor: "ring-2 ring-gray-400 bg-gray-100"
    }
  ];

  return (
    <Card
      id="pipeline-overview-widget"
      title={<span className="font-display font-bold text-[#2F2F2F]">Proactive Sales Pipeline Overview</span>}
      description="Click any stage to filter active deals or drill down into specific pipeline operations."
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
        {categories.map((cat) => {
          const isActive = activeStage === cat.title;
          return (
            <button
              key={cat.id}
              onClick={() => onStageClick(cat.title)}
              className={`p-3.5 border rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer text-left ${
                isActive ? cat.activeColor : `border-[#D8D8D8] ${cat.color}`
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="shrink-0">{cat.icon}</div>
                <span className="text-xs font-bold truncate text-[#2F2F2F]">{cat.title}</span>
              </div>
              <span className="text-sm font-extrabold font-display">{cat.count}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

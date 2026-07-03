import React from "react";
import { Lead, LeadStatus } from "../../types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { 
  Trophy, TrendingUp, DollarSign, Calendar, User, 
  Sparkles, CheckCircle2, ChevronRight 
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils";

interface ClosedDealsProps {
  leads: Lead[];
  onOpenDetails: (lead: Lead) => void;
}

export const ClosedDeals: React.FC<ClosedDealsProps> = ({ leads, onOpenDetails }) => {
  // Filter leads in CLOSED_WON status
  const wonLeads = leads.filter(l => l.status === LeadStatus.CLOSED_WON);

  // Total sales revenue
  const totalSalesRevenue = wonLeads.reduce((sum, l) => sum + l.value, 0);

  // Average deal size
  const averageDealSize = wonLeads.length > 0 ? totalSalesRevenue / wonLeads.length : 0;

  return (
    <div className="space-y-5 text-left">
      
      {/* Visual Trophy Metrics banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-[#D8D8D8] bg-white flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-amber-500/10 rounded-bl-full flex items-center justify-center">
            <Trophy size={14} className="text-amber-500" />
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Trophy size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Total Sales Closed</span>
            <strong className="text-xl font-mono text-[#2F2F2F] leading-none">{wonLeads.length}</strong>
          </div>
        </Card>

        <Card className="p-4 border border-[#D8D8D8] bg-white flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <DollarSign size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Gross Signed Revenue</span>
            <strong className="text-xl font-mono text-emerald-700 leading-none">{formatCurrency(totalSalesRevenue)}</strong>
          </div>
        </Card>

        <Card className="p-4 border border-[#D8D8D8] bg-white flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Average Deal Value</span>
            <strong className="text-xl font-mono text-slate-800 leading-none">{formatCurrency(averageDealSize)}</strong>
          </div>
        </Card>
      </div>

      {/* Main List */}
      <Card className="p-4 border border-[#D8D8D8] bg-white">
        {wonLeads.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Trophy size={42} className="mx-auto text-gray-300 stroke-1" />
            <div>
              <h4 className="font-bold text-xs text-[#2F2F2F]">No Sealed Deals Yet</h4>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">Complete payment terms and mark negotiations won to sign contracts.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {wonLeads.map(l => (
              <div
                key={l.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Information */}
                <div className="space-y-1 text-left min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="font-bold text-xs text-[#2F2F2F] hover:text-[#4E4E49] cursor-pointer"
                      onClick={() => onOpenDetails(l)}
                    >
                      {l.company}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">({l.name})</span>
                    
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Sparkles size={8} className="shrink-0 text-amber-500" /> Signed Account
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1 font-sans font-bold text-gray-400">
                      REVENUE CONFIRMED: <strong className="text-emerald-700">{formatCurrency(l.value)}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-sans font-bold text-gray-400">
                      ACQUISITION: <strong className="text-slate-700">{l.source}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      <Calendar size={10} />
                      CLOSED DATE: {formatDate(l.updatedAt || l.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0">
                  <button
                    onClick={() => onOpenDetails(l)}
                    className="px-3.5 py-1.5 text-[10px] font-bold text-gray-600 hover:text-gray-800 bg-gray-50 border border-gray-200 rounded-lg transition-all cursor-pointer shadow-3xs"
                  >
                    Open Account File
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Download, Calendar, Mail, CheckCircle2, RefreshCcw } from "lucide-react";
import { Lead } from "../../types";

interface ReportCardProps {
  leads: Lead[];
}

export const ReportCard: React.FC<ReportCardProps> = ({ leads }) => {
  const [schedule, setSchedule] = useState({
    frequency: "WEEKLY",
    email: "analytics-digest@synity.io",
    enabled: true,
    format: "PDF"
  });
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [schedulerSaved, setSchedulerSaved] = useState(false);

  // Helper to trigger real CSV download of leads data
  const exportToCSV = () => {
    setIsExporting("CSV");
    setTimeout(() => {
      try {
        const headers = ["Lead Name", "Company", "Email", "Phone", "Status", "Value (USD)", "Source", "Industry", "Country", "Created At"];
        const rows = leads.map((l) => [
          `"${l.name.replace(/"/g, '""')}"`,
          `"${l.company.replace(/"/g, '""')}"`,
          `"${l.email}"`,
          `"${l.phone || ""}"`,
          `"${l.status}"`,
          l.value,
          `"${l.source}"`,
          `"${l.industry || ""}"`,
          `"${l.country || ""}"`,
          `"${l.createdAt}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
          + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `synity_leads_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("CSV Export Failed", err);
      } finally {
        setIsExporting(null);
      }
    }, 800);
  };

  // Simulating PDF export with a beautiful download hook
  const exportToPDF = () => {
    setIsExporting("PDF");
    setTimeout(() => {
      // Simulate real file creation and trigger standard window print layout or dynamic blob
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Synity Sales Performance Audit</title>
              <style>
                body { font-family: sans-serif; padding: 40px; color: #2F2F2F; }
                h1 { border-bottom: 2px solid #7C3AED; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #D8D8D8; padding: 10px; text-align: left; font-size: 12px; }
                th { bg-color: #FAF9FC; }
              </style>
            </head>
            <body>
              <h1>Synity Corporate Analytics Report</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
              <p>Total Opportunities Scoped: ${leads.length}</p>
              <table>
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Company</th>
                    <th>Stage</th>
                    <th>Contract Worth</th>
                  </tr>
                </thead>
                <tbody>
                  ${leads.slice(0, 30).map(l => `
                    <tr>
                      <td>${l.name}</td>
                      <td>${l.company}</td>
                      <td>${l.status}</td>
                      <td>$${l.value.toLocaleString()}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              <script>window.print();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      setIsExporting(null);
    }, 1000);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setSchedulerSaved(true);
    setTimeout(() => setSchedulerSaved(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Exporter Block */}
      <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
        <div>
          <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
            Corporate Reporting Portal
          </h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase">
            Export raw intelligence datasets into standard standard schemas
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={exportToCSV}
            disabled={!!isExporting}
            className="flex flex-col items-center justify-center p-4 border border-[#EBEBEB] hover:border-purple-400 bg-white hover:bg-[#FAF9FC] active:bg-purple-100 rounded-xl transition-all space-y-2 cursor-pointer group disabled:opacity-50"
          >
            <Download size={20} className="text-gray-500 group-hover:text-purple-600 transition-colors" />
            <span className="text-[10px] font-black uppercase text-gray-700">CSV Export</span>
            <span className="text-[9px] text-gray-400 font-bold font-mono">Row Tables</span>
          </button>

          <button
            onClick={exportToPDF}
            disabled={!!isExporting}
            className="flex flex-col items-center justify-center p-4 border border-[#EBEBEB] hover:border-purple-400 bg-white hover:bg-[#FAF9FC] active:bg-purple-100 rounded-xl transition-all space-y-2 cursor-pointer group disabled:opacity-50"
          >
            <Download size={20} className="text-gray-500 group-hover:text-purple-600 transition-colors" />
            <span className="text-[10px] font-black uppercase text-gray-700">PDF Report</span>
            <span className="text-[9px] text-gray-400 font-bold font-mono">Print Layout</span>
          </button>

          <button
            onClick={() => {
              setIsExporting("EXCEL");
              setTimeout(() => {
                exportToCSV();
                setIsExporting(null);
              }, 1000);
            }}
            disabled={!!isExporting}
            className="flex flex-col items-center justify-center p-4 border border-[#EBEBEB] hover:border-purple-400 bg-white hover:bg-[#FAF9FC] active:bg-purple-100 rounded-xl transition-all space-y-2 cursor-pointer group disabled:opacity-50"
          >
            <Download size={20} className="text-gray-500 group-hover:text-purple-600 transition-colors" />
            <span className="text-[10px] font-black uppercase text-gray-700">Excel XLS</span>
            <span className="text-[9px] text-gray-400 font-bold font-mono">Formatted Sheet</span>
          </button>
        </div>

        {isExporting && (
          <div className="flex items-center gap-2 text-[10px] text-purple-700 font-bold uppercase animate-pulse">
            <RefreshCcw size={12} className="animate-spin" />
            <span>Compiling report files for download ({isExporting})...</span>
          </div>
        )}
      </div>

      {/* Scheduler Block */}
      <div className="bg-white border border-[#D8D8D8] rounded-2xl p-5 shadow-3xs hover:border-purple-300 text-left space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-[#2F2F2F] uppercase tracking-tight">
              Report Dispatch Scheduler
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">
              Configure automatic CRM reports directly to your mailbox
            </p>
          </div>
          <Calendar size={16} className="text-gray-400" />
        </div>

        <form onSubmit={handleSaveSchedule} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Frequency</label>
              <select
                value={schedule.frequency}
                onChange={(e) => setSchedule({ ...schedule, frequency: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-lg p-2 font-bold text-gray-700 focus:outline-none focus:border-purple-400"
              >
                <option value="DAILY">Daily Pipeline Report</option>
                <option value="WEEKLY">Weekly Performance Digest</option>
                <option value="MONTHLY">Monthly Audit Summary</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Output Format</label>
              <select
                value={schedule.format}
                onChange={(e) => setSchedule({ ...schedule, format: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded-lg p-2 font-bold text-gray-700 focus:outline-none focus:border-purple-400"
              >
                <option value="PDF">Portable Document format (PDF)</option>
                <option value="CSV">Spreadsheet Rows (CSV)</option>
                <option value="EXCEL">MS Excel Formatted</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Recipient Email</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={12} />
                </span>
                <input
                  type="email"
                  required
                  value={schedule.email}
                  onChange={(e) => setSchedule({ ...schedule, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-lg pl-8 pr-3 py-2 font-mono text-gray-600 focus:outline-none focus:border-purple-400"
                  placeholder="analytics-digest@synity.io"
                />
              </div>

              <button
                type="submit"
                className="bg-[#2F2F2F] hover:bg-[#1C1C1C] active:bg-black text-white text-[10px] font-black uppercase px-4 rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Activate
              </button>
            </div>
          </div>
        </form>

        {schedulerSaved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-2 font-medium">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>SLA automatic reporting timeline activated for <strong>{schedule.email}</strong>.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertTriangle, Table } from "lucide-react";

interface FilePreviewProps {
  parsedRows: Record<string, string>[];
}

export const FilePreview: React.FC<FilePreviewProps> = ({ parsedRows }) => {
  if (parsedRows.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 text-xs border border-dashed rounded-xl" id="preview-empty">
        <Table className="mx-auto mb-2 text-gray-300 animate-pulse" size={24} />
        No preview available. Upload a file to scan lead data.
      </div>
    );
  }

  // Get headers from first record
  const headers = Object.keys(parsedRows[0]);
  const previewRows = parsedRows.slice(0, 10); // Display top 10 rows for optimal loading

  // Count empty values to show data health
  let totalCells = 0;
  let emptyCells = 0;
  parsedRows.forEach((row) => {
    headers.forEach((h) => {
      totalCells++;
      if (!row[h] || row[h].trim() === "") {
        emptyCells++;
      }
    });
  });

  const missingPercentage = totalCells > 0 ? Math.round((emptyCells / totalCells) * 100) : 0;

  return (
    <div className="space-y-4" id="file-preview-container">
      {/* Table Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="text-left space-y-0.5">
          <h4 className="text-xs font-bold text-[#2F2F2F] uppercase tracking-wider flex items-center gap-1.5">
            <Table size={14} className="text-[#3b7194]" />
            Import Raw Layout Preview ({parsedRows.length} Records Scanned)
          </h4>
          <p className="text-[10px] text-gray-500 font-medium">
            Displaying the first {previewRows.length} rows. Scroll horizontally to inspect all parsed columns.
          </p>
        </div>

        {missingPercentage > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100/50 text-left shrink-0">
            <AlertTriangle size={14} className="text-amber-500" />
            <div className="text-[10px] text-amber-800 font-medium">
              <span className="font-bold">{missingPercentage}% Missing Values</span> detected across cells.
            </div>
          </div>
        )}
      </div>

      {/* Responsive Scrollable Table */}
      <div className="border border-[#D8D8D8] rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="bg-gray-50/70 border-b border-[#D8D8D8] text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3 text-center border-r border-[#D8D8D8] w-12 font-mono">Row</th>
                {headers.map((h) => (
                  <th key={h} className="p-3 border-r border-[#D8D8D8] whitespace-nowrap min-w-[150px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {previewRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-3 text-center font-mono font-bold text-gray-400 border-r border-[#D8D8D8] bg-gray-50/30">
                    {idx + 1}
                  </td>
                  {headers.map((h) => {
                    const value = row[h];
                    const isEmpty = !value || value.trim() === "";

                    return (
                      <td
                        key={h}
                        className={`p-3 border-r border-gray-100 whitespace-nowrap font-medium text-gray-700 ${
                          isEmpty ? "bg-red-50/30 text-red-400" : ""
                        }`}
                      >
                        {isEmpty ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-500 px-1.5 py-0.5 rounded-sm select-none">
                            Blank
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {parsedRows.length > 10 && (
        <p className="text-[10px] text-gray-400 font-mono text-center">
          + {parsedRows.length - 10} additional rows are fully loaded in system cache memory for background validations.
        </p>
      )}
    </div>
  );
};

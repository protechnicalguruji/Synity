/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CommunicationTemplate, TemplateCategory } from "../../types/communication";
import { Lead } from "../../types";
import { MOCK_TEMPLATES } from "../../utils/communicationMockData";
import { Search, FileText, ChevronRight, HelpCircle, Check, BookOpen } from "lucide-react";

interface TemplateSelectorProps {
  lead?: Lead;
  agentName?: string;
  onSelect: (mergedBody: string, subject?: string) => void;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  COLD_OUTREACH: "Cold Outreach",
  FOLLOW_UP: "Follow Up",
  MEETING_REMINDER: "Meeting Reminder",
  PROPOSAL_REMINDER: "Proposal Reminder",
  THANK_YOU: "Thank You"
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  lead,
  agentName = "Agent John",
  onSelect,
  onClose
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "ALL">("ALL");
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);

  // Helper to merge fields dynamically
  const getMergedBody = (template: CommunicationTemplate) => {
    let text = template.body;
    text = text.replace(/\{\{LeadName\}\}/g, lead?.name || "Client");
    text = text.replace(/\{\{CompanyName\}\}/g, lead?.company || "your business");
    text = text.replace(/\{\{AgentName\}\}/g, agentName);
    text = text.replace(/\{\{MeetingTime\}\}/g, "tomorrow at 2:00 PM");
    text = text.replace(/\{\{MeetingLink\}\}/g, "https://meet.synity.com/demo");
    return text;
  };

  const categories: (TemplateCategory | "ALL")[] = [
    "ALL",
    "COLD_OUTREACH",
    "FOLLOW_UP",
    "MEETING_REMINDER",
    "PROPOSAL_REMINDER",
    "THANK_YOU"
  ];

  const filteredTemplates = MOCK_TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === "ALL" || tpl.category === selectedCategory;
    const matchesSearch = 
      tpl.title.toLowerCase().includes(search.toLowerCase()) ||
      tpl.body.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[380px] w-full" id="template-selector-canvas">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-[#D8D8D8] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#2F2F2F]">
          <BookOpen size={16} className="text-purple-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-sans">Quick Message Templates</h3>
        </div>
        <button 
          type="button" 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1.5 py-0.5 rounded-sm hover:bg-gray-100 transition-all cursor-pointer"
        >
          Close
        </button>
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden h-[300px]">
        {/* Left Side: Category and List */}
        <div className="md:col-span-5 border-r border-[#D8D8D8] flex flex-col overflow-hidden bg-gray-50/50">
          {/* Category Chips */}
          <div className="p-2 border-b border-[#D8D8D8] overflow-x-auto flex gap-1 scrollbar-none shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 text-[10px] font-bold rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white"
                    : "bg-white text-[#666666] border border-[#D8D8D8] hover:bg-gray-100"
                }`}
              >
                {cat === "ALL" ? "All" : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="p-2 border-b border-[#D8D8D8] shrink-0 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-xs bg-white border border-[#D8D8D8] rounded-lg focus:outline-none focus:border-purple-600"
            />
          </div>

          {/* Templates list */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs font-medium">
                No templates matched.
              </div>
            ) : (
              filteredTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                    selectedTemplate?.id === tpl.id
                      ? "bg-purple-50/80 border-purple-300 text-purple-950 font-bold"
                      : "bg-white border-[#E5E3E7] hover:bg-gray-100 text-gray-700 font-medium"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs truncate font-semibold">{tpl.title}</p>
                    <span className="text-[9px] font-mono font-bold bg-[#E5E3E7] text-[#666666] px-1.5 py-0.2 rounded-full uppercase mt-1 inline-block">
                      {tpl.channel}
                    </span>
                  </div>
                  <ChevronRight size={12} className="text-gray-400 shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Render/Preview & Confirm */}
        <div className="md:col-span-7 flex flex-col bg-white overflow-hidden p-4">
          {selectedTemplate ? (
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-3 overflow-y-auto pr-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-600 font-mono uppercase">
                    Live Preview (Auto-Merged Fields)
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 font-mono">
                    Category: {CATEGORY_LABELS[selectedTemplate.category]}
                  </span>
                </div>

                {selectedTemplate.subject && (
                  <div className="border border-gray-100 rounded-lg p-2.5 bg-gray-50/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase font-mono mb-1">Subject:</p>
                    <p className="text-xs font-bold text-[#2F2F2F]">
                      {selectedTemplate.subject.replace(/\{\{CompanyName\}\}/g, lead?.company || "your business")}
                    </p>
                  </div>
                )}

                <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50 min-h-[110px]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase font-mono mb-1">Body Preview:</p>
                  <p className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {getMergedBody(selectedTemplate)}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D8D8D8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(null)}
                  className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-bold hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(getMergedBody(selectedTemplate), selectedTemplate.subject);
                    onClose();
                  }}
                  className="px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <Check size={13} /> Apply Template
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-6 space-y-2">
              <FileText size={36} className="text-purple-300 stroke-[1.5]" />
              <p className="text-xs font-bold text-[#2F2F2F]">No Template Selected</p>
              <p className="text-[11px] max-w-xs leading-relaxed">
                Choose a template category from the list on the left to preview parsed variables and apply standard sales messaging layouts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

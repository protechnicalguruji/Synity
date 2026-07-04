/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Zap, ArrowRight, Sparkles, AlertCircle, FileText, Share2 } from "lucide-react";
import { AutomationTemplate } from "../../types";

interface AutomationTemplateCardProps {
  template: AutomationTemplate;
  onUseTemplate: (template: AutomationTemplate) => void;
}

export const AutomationTemplateCard: React.FC<AutomationTemplateCardProps> = ({
  template,
  onUseTemplate,
}) => {
  // Get Category Icon & Color Scheme
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "Nurturing":
        return {
          icon: <Sparkles className="text-amber-600" size={16} />,
          bg: "bg-amber-50 border-amber-100",
          badge: "bg-amber-100 text-amber-800"
        };
      case "Recovery":
        return {
          icon: <AlertCircle className="text-rose-600" size={16} />,
          bg: "bg-rose-50 border-rose-100",
          badge: "bg-rose-100 text-rose-800"
        };
      case "Communication":
        return {
          icon: <Share2 className="text-blue-600" size={16} />,
          bg: "bg-blue-50 border-blue-100",
          badge: "bg-blue-100 text-blue-800"
        };
      case "Operations":
      default:
        return {
          icon: <FileText className="text-purple-600" size={16} />,
          bg: "bg-purple-50 border-purple-100",
          badge: "bg-purple-100 text-purple-800"
        };
    }
  };

  const theme = getCategoryTheme(template.category);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)" }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full bg-white rounded-xl border border-[#D8D8D8] overflow-hidden group shadow-sm"
      id={`template-card-${template.id}`}
    >
      <div className="p-5 flex-1">
        {/* Header with category badge & icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${theme.bg}`}>
              {theme.icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${theme.badge}`}>
              {template.category}
            </span>
          </div>
          <div className="text-[#666666] group-hover:text-[#2F2F2F] transition-colors">
            <Zap size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-sans font-semibold text-[#2F2F2F] text-base leading-snug tracking-tight mb-2 group-hover:text-black transition-colors">
          {template.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#666666] leading-relaxed mb-4 font-normal">
          {template.description}
        </p>

        {/* Technical Flow preview in Mono */}
        <div className="mt-auto bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col gap-1.5 font-mono text-[10px] text-[#60605B]">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#8E44AD] uppercase">Trigger:</span>
            <span className="truncate">{template.trigger.type.replace(/_/g, " ")}</span>
          </div>
          {template.conditionGroup.conditions.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#0A66C2] uppercase">If:</span>
              <span className="truncate">
                {template.conditionGroup.conditions.map((c: any) => c.field || "").join(` ${template.conditionGroup.logicalOperator} `)}
              </span>
            </div>
          )}
          <div className="flex items-start gap-1.5">
            <span className="font-bold text-[#137333] uppercase shrink-0">Action:</span>
            <div className="flex flex-col gap-0.5 min-w-0">
              {template.actions.map((act, index) => (
                <span key={act.id} className="truncate block">
                  {index + 1}. {act.type.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer trigger button */}
      <div className="px-5 py-3.5 bg-gray-50/50 border-t border-[#D8D8D8]/60 flex items-center justify-between group-hover:bg-white transition-colors">
        <span className="text-[11px] text-[#666666] font-medium group-hover:text-[#2F2F2F] transition-colors">
          Click to pre-fill rule builder
        </span>
        <button
          onClick={() => onUseTemplate(template)}
          className="p-1.5 rounded-full bg-[#E5E3E7] hover:bg-[#4E4E49] hover:text-white text-[#2F2F2F] transition-all cursor-pointer flex items-center justify-center shadow-xs"
          title="Instantiate template"
          id={`use-template-btn-${template.id}`}
        >
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

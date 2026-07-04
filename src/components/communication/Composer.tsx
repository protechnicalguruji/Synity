/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Lead } from "../../types";
import { TemplateSelector } from "./TemplateSelector";
import { 
  Send, 
  Smile, 
  Paperclip, 
  BookOpen, 
  CalendarClock, 
  Sparkles, 
  FileText, 
  X, 
  Check, 
  ArrowRight,
  ChevronDown
} from "lucide-react";

interface ComposerProps {
  lead?: Lead;
  onSendMessage: (body: string, type: "TEXT" | "PDF" | "FILE", attachments?: Array<{ name: string; url: string; size: string; type: string }>) => void;
  aiSuggestions?: string[];
  channel: string;
}

const POPULAR_EMOJIS = ["😊", "👍", "🤝", "🔥", "📈", "📅", "💡", "🙌", "✉️", "✅", "👋", "✨"];

export const Composer: React.FC<ComposerProps> = ({
  lead,
  onSendMessage,
  aiSuggestions = [
    "Sounds great, let's lock in tomorrow afternoon for the tech demo.",
    "I understand. Let me draft a customized cost-benefit analysis for your team.",
    "Would it be helpful if I shared our technical compliance PDF first?"
  ],
  channel
}) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showScheduleSend, setShowScheduleSend] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  
  // Simulated attachments state
  const [attachments, setAttachments] = useState<Array<{ name: string; url: string; size: string; type: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scheduled send time state
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    
    // Determine type based on attachments
    let type: "TEXT" | "PDF" | "FILE" = "TEXT";
    if (attachments.length > 0) {
      const isPdf = attachments[0].name.toLowerCase().endsWith(".pdf");
      type = isPdf ? "PDF" : "FILE";
    }

    // Call onSend
    onSendMessage(
      text, 
      type, 
      attachments.length > 0 ? attachments : undefined
    );

    // Clear state
    setText("");
    setAttachments([]);
    setScheduledTime(null);
    setShowEmojiPicker(false);
    setShowScheduleSend(false);
    setShowAiSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    
    // Add fake attachment details
    setAttachments([
      {
        name: file.name,
        url: "https://example.com/mock_uploads/" + file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: isPdf ? "pdf" : "file"
      }
    ]);
  };

  const removeAttachment = () => {
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const applyTemplate = (mergedBody: string) => {
    setText(mergedBody);
    setShowTemplateSelector(false);
  };

  return (
    <div className="space-y-3 relative" id="composer-main-canvas">
      {/* 1. TEMPLATE SELECTOR COLLAPSIBLE POPUP PANEL */}
      {showTemplateSelector && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <TemplateSelector
            lead={lead}
            onSelect={applyTemplate}
            onClose={() => setShowTemplateSelector(false)}
          />
        </div>
      )}

      {/* 2. SCHEDULE SEND MINI CONTROL PANEL */}
      {showScheduleSend && (
        <div className="bg-[#F8F7FA] border border-[#D8D8D8] p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-1 text-left">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#2F2F2F] flex items-center gap-1.5">
              <CalendarClock size={13} className="text-purple-600 animate-pulse" />
              Schedule Inbound Delivery
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              Queue this message to be transmitted automatically during optimized CRM work hours.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={scheduledTime || ""}
              onChange={(e) => setScheduledTime(e.target.value || null)}
              className="text-xs bg-white border border-[#D8D8D8] p-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
            >
              <option value="">Send Immediately</option>
              <option value="1H">In 1 Hour (Optimized)</option>
              <option value="2H">In 2 Hours (Target Peak)</option>
              <option value="9AM">Tomorrow at 9:00 AM</option>
              <option value="FRI">Friday afternoon</option>
            </select>
            {scheduledTime && (
              <button 
                type="button" 
                onClick={() => setScheduledTime(null)}
                className="text-[10px] text-red-500 font-bold hover:underline"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowScheduleSend(false)}
              className="text-xs bg-gray-200 hover:bg-gray-300 text-[#2F2F2F] font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. AI REPLY RECOMMENDATIONS */}
      {showAiSuggestions && (
        <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3 space-y-2 animate-in fade-in slide-in-from-bottom-2 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-purple-600 animate-pulse fill-purple-100" />
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wide">
                AI Next Best Reply Recommendations
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAiSuggestions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {aiSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setText(suggestion);
                  setShowAiSuggestions(false);
                }}
                className="text-left text-[11px] p-2.5 bg-white border border-purple-100 rounded-lg hover:border-purple-400 text-[#2F2F2F] leading-snug font-medium transition-all hover:shadow-xs active:scale-98 cursor-pointer group flex flex-col justify-between"
              >
                <span className="line-clamp-3">{suggestion}</span>
                <span className="text-[9px] font-bold text-purple-600 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all self-end">
                  Insert <ArrowRight size={10} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. MAIN INPUT CANVAS */}
      <div className="bg-white border border-[#D8D8D8] rounded-xl overflow-hidden focus-within:border-purple-600 focus-within:shadow-md transition-all">
        {/* Attachment Display Area */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 border-b border-[#D8D8D8] flex items-center justify-between animate-in slide-in-from-top-1 text-left">
            <div className="flex items-center gap-2 text-xs">
              <FileText size={14} className="text-purple-600" />
              <span className="font-bold text-[#2F2F2F] truncate max-w-sm">
                {attachments[0].name}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                ({attachments[0].size})
              </span>
            </div>
            <button
              type="button"
              onClick={removeAttachment}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Input Text Area */}
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`Type an ${channel.toLowerCase()} message to ${lead?.name || "the lead"}... (Shift+Enter for new line)`}
          className="w-full px-4 py-3 text-xs sm:text-sm bg-transparent border-0 outline-none resize-none placeholder-gray-400 text-gray-800 font-medium"
        />

        {/* Action Toolbar */}
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Hidden native input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleSimulatedFileUpload} 
              className="hidden" 
            />
            
            {/* 1. Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-lg transition-all cursor-pointer"
              title="Add PDF or File attachment"
            >
              <Paperclip size={15} />
            </button>

            {/* 2. Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                showEmojiPicker ? "bg-purple-100 text-purple-700" : "text-gray-400 hover:text-gray-700 hover:bg-gray-200/60"
              }`}
              title="Insert Emoji"
            >
              <Smile size={15} />
            </button>

            {/* 3. Document Templates Button */}
            <button
              type="button"
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                showTemplateSelector ? "bg-purple-100 text-purple-700" : "text-gray-400 hover:text-gray-700 hover:bg-gray-200/60"
              }`}
              title="Select communication templates"
            >
              <BookOpen size={15} />
            </button>

            {/* 4. Schedule Send Button */}
            <button
              type="button"
              onClick={() => setShowScheduleSend(!showScheduleSend)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                showScheduleSend ? "bg-purple-100 text-purple-700" : "text-gray-400 hover:text-gray-700 hover:bg-gray-200/60"
              }`}
              title="Schedule delivery time"
            >
              <CalendarClock size={15} />
            </button>

            {/* 5. AI Suggestions Toggle */}
            <button
              type="button"
              onClick={() => setShowAiSuggestions(!showAiSuggestions)}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-xs font-bold ${
                showAiSuggestions ? "bg-purple-100 text-purple-700" : "text-purple-600 hover:bg-purple-50"
              }`}
              title="Show AI Suggested Replies"
            >
              <Sparkles size={14} className="fill-purple-200" />
              <span className="hidden sm:inline">AI Suggestions</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {scheduledTime && (
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 flex items-center gap-1">
                <CalendarClock size={10} />
                Scheduled: {scheduledTime}
              </span>
            )}
            
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() && attachments.length === 0}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer select-none shadow-sm ${
                (text.trim() || attachments.length > 0)
                  ? "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span>Send</span>
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Emoji Picker Overlay Inline Tray */}
      {showEmojiPicker && (
        <div className="bg-white border border-[#D8D8D8] p-2 rounded-xl flex flex-wrap gap-1.5 shadow-md animate-in fade-in slide-in-from-top-1 text-left">
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono w-full px-1 mb-1">
            Click to insert emoji:
          </div>
          {POPULAR_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="text-base p-1 hover:bg-gray-100 rounded-lg active:scale-90 transition-all cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

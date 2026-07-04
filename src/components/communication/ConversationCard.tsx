/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Conversation, CommunicationChannel } from "../../types/communication";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Send, 
  Slack, 
  MessageCircle,
  Pin,
  CheckCheck,
  Check,
  Clock
} from "lucide-react";

interface ConversationCardProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
}

export const getChannelIcon = (channel: CommunicationChannel, size = 14) => {
  switch (channel) {
    case "EMAIL":
      return <Mail size={size} />;
    case "WHATSAPP":
      return <MessageSquare size={size} />;
    case "PHONE":
      return <Phone size={size} />;
    case "LINKEDIN":
      return <Linkedin size={size} />;
    case "INSTAGRAM":
      return <Instagram size={size} />;
    case "FACEBOOK":
      return <Facebook size={size} />;
    case "TELEGRAM":
      return <Send size={size} />;
    case "SLACK":
      return <Slack size={size} />;
    case "SMS":
      return <MessageCircle size={size} />;
    default:
      return <MessageSquare size={size} />;
  }
};

export const getChannelStyle = (channel: CommunicationChannel) => {
  switch (channel) {
    case "EMAIL":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "WHATSAPP":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "PHONE":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "LINKEDIN":
      return "bg-indigo-50 text-indigo-600 border-indigo-100";
    case "INSTAGRAM":
      return "bg-pink-50 text-pink-600 border-pink-100";
    case "FACEBOOK":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "TELEGRAM":
      return "bg-sky-50 text-sky-600 border-sky-100";
    case "SLACK":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "SMS":
      return "bg-teal-50 text-teal-600 border-teal-100";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isSelected,
  onSelect
}) => {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div
      id={`conversation-card-${conversation.id}`}
      onClick={onSelect}
      className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative select-none flex flex-col gap-2 ${
        isSelected
          ? "bg-purple-50/70 border-purple-300 shadow-2xs"
          : "bg-white border-[#E5E3E7] hover:border-gray-300 hover:shadow-2xs"
      }`}
    >
      {/* Top row: Channel Badge & Time / Pin */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${getChannelStyle(conversation.channel)}`}>
            {getChannelIcon(conversation.channel, 13)}
          </span>
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
            {conversation.channel}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {conversation.isPinned && (
            <Pin size={11} className="text-purple-600 fill-purple-100 rotate-45" />
          )}
          <span className="text-[10px] font-mono text-gray-400 font-bold">
            {formatTime(conversation.lastMessageTimestamp)}
          </span>
        </div>
      </div>

      {/* Middle row: Lead & Company */}
      <div className="space-y-0.5">
        <h4 className="text-xs sm:text-sm font-bold text-[#2F2F2F] truncate">
          {conversation.leadName}
        </h4>
        <p className="text-[11px] font-semibold text-gray-400 truncate">
          {conversation.businessName}
        </p>
      </div>

      {/* Bottom row: Message Snippet & Badges */}
      <div className="flex items-start justify-between gap-3 mt-0.5">
        <p className="text-xs text-gray-500 font-medium truncate flex-1 leading-snug">
          {conversation.lastMessageText}
        </p>

        {conversation.unreadCount > 0 && (
          <span className="text-[9px] font-mono font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded-full shrink-0 animate-pulse">
            {conversation.unreadCount}
          </span>
        )}
      </div>

      {/* SLA alert indicator */}
      {conversation.reminders.length > 0 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-3.5 flex items-center gap-1 text-[9px] text-purple-600 bg-purple-50 border border-purple-100 px-1 rounded-sm font-mono font-bold">
          <Clock size={8} /> SLA
        </div>
      )}
    </div>
  );
};

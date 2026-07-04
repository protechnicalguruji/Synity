/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import { Conversation, Message, CommunicationChannel } from "../../types/communication";
import { Lead } from "../../types";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";
import { getChannelIcon, getChannelStyle } from "./ConversationCard";
import { 
  Pin, 
  Trash2, 
  AlertCircle, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  HelpCircle,
  Clock,
  MoreVertical,
  CheckCircle2,
  Lock
} from "lucide-react";

interface ConversationViewProps {
  conversation?: Conversation;
  lead?: Lead;
  onSendMessage: (body: string, type: "TEXT" | "PDF" | "FILE", attachments?: any[]) => void;
  onTogglePin: () => void;
  onClearThread?: () => void;
  connectionError?: boolean;
  onRetryConnection?: () => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  lead,
  onSendMessage,
  onTogglePin,
  onClearThread,
  connectionError = false,
  onRetryConnection
}) => {
  const threadEndRef = useRef<HTMLDivElement>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages?.length, conversation?.id]);

  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (connectionError) {
    return (
      <div className="bg-white border border-[#D8D8D8] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full space-y-4" id="connection-error-view">
        <div className="p-4 bg-red-50 text-red-500 rounded-full animate-bounce">
          <AlertCircle size={36} />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-sm font-bold text-[#2F2F2F]">Hub Connection Failure</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            The integration server encountered a transient timeout while querying downstream pipeline headers. Please check security rules or re-authenticate.
          </p>
        </div>
        <button
          type="button"
          onClick={onRetryConnection}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <RefreshCw size={12} className="animate-spin-reverse" /> Retry Synchronization
        </button>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="bg-white border border-[#D8D8D8] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full space-y-3" id="empty-conversation-view">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
          <HelpCircle size={30} className="stroke-[1.5]" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-sm font-bold text-[#2F2F2F]">No Thread Loaded</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Select a live chat or inbound thread from the Left Panel list to view the message history, run cognitive summaries, and write messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D8D8D8] rounded-2xl h-full flex flex-col overflow-hidden shadow-2xs" id="conversation-view-main">
      {/* 1. THREAD HEADER */}
      <div className="px-4 py-3.5 border-b border-[#D8D8D8] bg-gray-50/50 flex items-center justify-between shrink-0 text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2 rounded-xl border flex items-center justify-center ${getChannelStyle(conversation.channel)}`}>
            {getChannelIcon(conversation.channel, 16)}
          </div>
          <div className="min-w-0 space-y-0.5">
            <h3 className="text-sm font-bold text-[#2F2F2F] truncate flex items-center gap-2">
              {conversation.leadName}
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" title="Channel synchronized" />
            </h3>
            <p className="text-[11px] font-semibold text-gray-500 truncate">
              {conversation.businessName} • Connected on {conversation.channel}
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onTogglePin}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              conversation.isPinned
                ? "bg-purple-50 border-purple-200 text-purple-700 font-bold"
                : "bg-white border-[#D8D8D8] text-gray-400 hover:text-gray-700"
            }`}
            title={conversation.isPinned ? "Unpin conversation" : "Pin conversation to top"}
          >
            <Pin size={13} className={conversation.isPinned ? "rotate-45 fill-purple-100" : "rotate-45"} />
          </button>

          {onClearThread && (
            <button
              type="button"
              onClick={onClearThread}
              className="p-1.5 bg-white border border-[#D8D8D8] text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              title="Clear message history log"
            >
              <Trash2 size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              showShortcutsHelp
                ? "bg-purple-100 border-purple-200 text-purple-700"
                : "bg-white border-[#D8D8D8] text-gray-400 hover:text-gray-700"
            }`}
            title="Keyboard Shortcuts & Security Rules"
          >
            <HelpCircle size={13} />
          </button>
        </div>
      </div>

      {/* Shortcuts overlay banner */}
      {showShortcutsHelp && (
        <div className="bg-[#FAF9FC] border-b border-[#DDD3E6] px-4 py-3 text-xs text-left text-gray-600 space-y-1.5 animate-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-700 flex items-center gap-1.5">
              <Lock size={12} /> Secure Architecture & Control Manual
            </span>
            <button 
              type="button" 
              onClick={() => setShowShortcutsHelp(false)} 
              className="text-gray-400 hover:text-gray-600 font-mono font-bold"
            >
              ×
            </button>
          </div>
          <p className="font-medium text-[11px] leading-relaxed">
            - **Keyboard Short:** Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded-sm font-mono font-bold shadow-3xs">Enter</kbd> to send messages, and <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded-sm font-mono font-bold shadow-3xs">Shift+Enter</kbd> to add line breaks.
          </p>
          <p className="font-medium text-[11px] leading-relaxed text-gray-500">
            - **Privacy Matrix:** Communication channels operate server-side using secure API wrappers. Client-to-client traffic logs are stored transiently inside CRM localStorage to preserve high isolation.
          </p>
        </div>
      )}

      {/* 2. CHRONOLOGICAL CHAT CANVAS */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#FAF9FC] space-y-2">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400 space-y-1">
            <CheckCircle2 size={24} className="text-emerald-500 animate-pulse" />
            <p className="text-xs font-bold text-[#2F2F2F]">Conversation Thread Initiated</p>
            <p className="text-[10px] max-w-xs">Write a greeting message or apply a template below to start chatting.</p>
          </div>
        ) : (
          conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={threadEndRef} />
      </div>

      {/* 3. RICH-TEXT MESSAGE COMPOSER */}
      <div className="p-4 border-t border-[#D8D8D8] bg-white shrink-0">
        <Composer
          lead={lead}
          onSendMessage={onSendMessage}
          channel={conversation.channel}
        />
      </div>
    </div>
  );
};

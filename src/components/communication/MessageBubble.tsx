/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Message, MessageStatus, MessageType } from "../../types/communication";
import { 
  Check, 
  CheckCheck, 
  Clock, 
  AlertCircle, 
  FileText, 
  MapPin, 
  ExternalLink, 
  Play, 
  Pause, 
  Mic, 
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [voicePlaying, setVoicePlaying] = useState(false);
  const isIncoming = message.senderType === "INCOMING";
  const isSystem = message.senderType === "SYSTEM";

  // Status Indicators
  const renderStatus = (status?: MessageStatus) => {
    if (!status) return null;
    switch (status) {
      case "QUEUED":
        return <Clock size={12} className="text-gray-400 animate-pulse" />;
      case "SENT":
        return <Check size={12} className="text-gray-400" />;
      case "DELIVERED":
        return <CheckCheck size={12} className="text-gray-400" />;
      case "READ":
        return <CheckCheck size={12} className="text-purple-600 font-bold" />;
      case "FAILED":
        return <AlertCircle size={12} className="text-red-500 animate-bounce" />;
      default:
        return null;
    }
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isSystem) {
    const isMeeting = message.systemEventDetails?.eventType === "MEETING_SCHEDULED";
    const isFollowUp = message.systemEventDetails?.eventType === "FOLLOW_UP_CREATED";
    const isProposal = message.systemEventDetails?.eventType === "PROPOSAL_SENT";
    const isStatusChange = message.systemEventDetails?.eventType === "STATUS_CHANGED";

    return (
      <div className="flex justify-center my-3" id={`msg-system-${message.id}`}>
        <div className="bg-[#F3F2F5] border border-[#E5E3E7] text-[#2F2F2F] text-xs px-4 py-2.5 rounded-xl shadow-xs max-w-md flex flex-col gap-1.5 transition-all hover:border-gray-400">
          <div className="flex items-center gap-2 font-bold text-gray-700">
            {isMeeting && <Calendar size={13} className="text-blue-500" />}
            {isFollowUp && <Clock size={13} className="text-orange-500" />}
            {isProposal && <FileText size={13} className="text-purple-500" />}
            {isStatusChange && <Layers size={13} className="text-emerald-500" />}
            <span>{message.body}</span>
          </div>
          {message.systemEventDetails?.meta && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-gray-500 font-mono mt-1 pt-1.5 border-t border-[#D8D8D8]">
              {Object.entries(message.systemEventDetails.meta).map(([key, value]) => (
                <div key={key} className="truncate">
                  <span className="font-semibold uppercase text-gray-400 mr-1">{key}:</span>
                  <span className="text-gray-700 font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}
          <span className="text-[9px] text-gray-400 self-end font-mono mt-0.5">{formattedTime}</span>
        </div>
      </div>
    );
  }

  // Bubble styling variables
  const bubbleBg = isIncoming 
    ? "bg-white border border-[#E5E3E7] text-[#2F2F2F] rounded-tl-xs rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-2xs" 
    : "bg-purple-600 text-white rounded-tl-2xl rounded-tr-xs rounded-br-2xl rounded-bl-2xl shadow-2xs";

  const timeColor = isIncoming ? "text-gray-400" : "text-purple-200";

  return (
    <div 
      className={`flex flex-col ${isIncoming ? "items-start" : "items-end"} mb-4 px-1`}
      id={`message-bubble-wrapper-${message.id}`}
    >
      <div className="flex flex-col max-w-[85%] sm:max-w-[70%]">
        {/* Optional Name display for incoming group conversations */}
        {isIncoming && (
          <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider font-mono">
            {message.senderName}
          </span>
        )}

        <div className={`p-3.5 ${bubbleBg} space-y-2 relative transition-all`}>
          {/* 1. TEXT MESSAGE TYPE */}
          {message.type === "TEXT" && (
            <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-medium">
              {message.body}
            </p>
          )}

          {/* 2. IMAGE MESSAGE TYPE */}
          {message.type === "IMAGE" && (
            <div className="space-y-2">
              <div className="rounded-lg overflow-hidden border border-[#D8D8D8] bg-gray-100 max-h-48">
                <img 
                  src={message.attachments?.[0]?.url || "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=400"} 
                  alt="Attachment" 
                  className="w-full h-full object-cover max-h-48 hover:scale-105 transition-all duration-300 cursor-pointer"
                  referrerPolicy="no-referrer"
                />
              </div>
              {message.body && (
                <p className="text-xs sm:text-sm font-medium">{message.body}</p>
              )}
            </div>
          )}

          {/* 3. FILE / PDF MESSAGE TYPE */}
          {(message.type === "FILE" || message.type === "PDF") && (
            <div className="space-y-2">
              <div className={`p-3 rounded-lg flex items-center gap-3 border ${
                isIncoming ? "bg-[#F8F7FA] border-[#E5E3E7]" : "bg-purple-700/50 border-purple-500"
              }`}>
                <div className={`p-2 rounded-md ${isIncoming ? "bg-purple-50 text-purple-600" : "bg-purple-800 text-white"}`}>
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-bold truncate font-sans">
                    {message.attachments?.[0]?.name || "Document_Attachment.pdf"}
                  </p>
                  <p className="text-[10px] opacity-75 font-mono">
                    {message.attachments?.[0]?.size || "840 KB"} • {message.type}
                  </p>
                </div>
                <a 
                  href={message.attachments?.[0]?.url || "#"} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`p-1.5 rounded-full hover:scale-110 transition-all ${
                    isIncoming ? "hover:bg-gray-200 text-gray-500" : "hover:bg-purple-800 text-purple-100"
                  }`}
                  title="Open/Download Document"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
              {message.body && (
                <p className="text-xs sm:text-sm font-medium">{message.body}</p>
              )}
            </div>
          )}

          {/* 4. VOICE NOTE MESSAGE TYPE */}
          {message.type === "VOICE_NOTE" && (
            <div className="flex items-center gap-3 w-56 sm:w-64 py-1">
              <button
                type="button"
                onClick={() => setVoicePlaying(!voicePlaying)}
                className={`p-2.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isIncoming ? "bg-purple-50 text-purple-600 hover:bg-purple-100" : "bg-white text-purple-600 hover:scale-105"
                }`}
                aria-label="Play voice note"
              >
                {voicePlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
              </button>
              <div className="flex-1 space-y-1">
                {/* Simulated Audio Waveform */}
                <div className="flex items-end gap-[2px] h-6 px-1 pt-1.5">
                  {[4, 10, 14, 8, 12, 18, 14, 6, 10, 16, 20, 12, 6, 14, 8, 4].map((h, i) => (
                    <span 
                      key={i} 
                      className={`flex-1 rounded-full transition-all ${
                        voicePlaying ? "animate-pulse" : ""
                      } ${
                        isIncoming ? "bg-purple-300" : "bg-purple-200"
                      }`} 
                      style={{ 
                        height: `${h}px`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] px-1 font-mono">
                  <span className={timeColor}>{voicePlaying ? "0:12" : "0:00"}</span>
                  <span className={`flex items-center gap-1 ${timeColor}`}>
                    <Mic size={10} /> 0:38
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 5. LOCATION MESSAGE TYPE */}
          {message.type === "LOCATION" && (
            <div className="space-y-2">
              <div className={`p-3 rounded-lg border flex items-start gap-3 text-left ${
                isIncoming ? "bg-[#F8F7FA] border-[#E5E3E7]" : "bg-purple-700/50 border-purple-500"
              }`}>
                <div className="p-2 bg-red-50 text-red-500 rounded-md shrink-0">
                  <MapPin size={18} fill="currentColor" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold font-sans">Shared Location</p>
                  <p className="text-[11px] opacity-90 leading-tight mt-0.5">{message.body}</p>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(message.body)}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-purple-400 hover:text-purple-300"
                  >
                    View on Google Maps <ArrowRight size={10} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 6. LINK MESSAGE TYPE */}
          {message.type === "LINK" && (
            <div className="space-y-1 text-left">
              <a 
                href={message.body} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs sm:text-sm font-bold underline break-all flex items-center gap-1 text-purple-300 hover:text-white"
              >
                {message.body}
                <ExternalLink size={12} />
              </a>
              <div className="text-[10px] text-purple-200 font-medium">
                Shared web page link.
              </div>
            </div>
          )}

          {/* Bubble Bottom Tray (Timestamp + Receipt indicators) */}
          <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono mt-1 select-none">
            <span className={timeColor}>{formattedTime}</span>
            {!isIncoming && renderStatus(message.status)}
          </div>
        </div>
      </div>
    </div>
  );
};

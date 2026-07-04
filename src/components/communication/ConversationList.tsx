/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Conversation, CommunicationChannel } from "../../types/communication";
import { ConversationCard } from "./ConversationCard";
import { 
  Search, 
  Filter, 
  Pin, 
  Mail, 
  CheckCheck, 
  Plus, 
  VolumeX, 
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  isLoading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading = false
}) => {
  const [search, setSearch] = useState("");
  const [activeChannel, setActiveChannel] = useState<"ALL" | CommunicationChannel>("ALL");
  const [filterUnread, setFilterUnread] = useState(false);
  const [filterPinned, setFilterPinned] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter channels
  const channels: ("ALL" | CommunicationChannel)[] = [
    "ALL",
    "EMAIL",
    "WHATSAPP",
    "PHONE"
  ];

  // Apply search and filter logic
  const filtered = conversations.filter((conv) => {
    // Search terms match
    const q = search.toLowerCase();
    const matchesSearch = 
      conv.leadName.toLowerCase().includes(q) ||
      conv.businessName.toLowerCase().includes(q) ||
      conv.lastMessageText.toLowerCase().includes(q);

    // Channel match
    const matchesChannel = activeChannel === "ALL" || conv.channel === activeChannel;

    // Unread match
    const matchesUnread = !filterUnread || conv.unreadCount > 0;

    // Pinned match
    const matchesPinned = !filterPinned || conv.isPinned;

    return matchesSearch && matchesChannel && matchesUnread && matchesPinned;
  });

  // Separate pinned vs standard
  const pinnedConversations = filtered.filter((c) => c.isPinned);
  const recentConversations = filtered.filter((c) => !c.isPinned);

  // Loading skeleton placeholder generator
  const renderSkeletons = () => (
    <div className="space-y-3 p-1" id="loading-skeletons-group">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border border-gray-200 bg-white rounded-xl p-3 space-y-2.5 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-5 w-16 bg-gray-200 rounded-sm" />
            <div className="h-4 w-12 bg-gray-100 rounded-sm" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
            <div className="h-3 w-1/2 bg-gray-100 rounded-md" />
          </div>
          <div className="h-3.5 w-full bg-gray-200 rounded-sm" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white border border-[#D8D8D8] rounded-2xl overflow-hidden shadow-2xs" id="conversation-list-container">
      {/* Search Header */}
      <div className="p-4 border-b border-[#D8D8D8] space-y-3 shrink-0 text-left bg-gray-50/30">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search leads, chats, emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#D8D8D8] rounded-xl focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-all"
          />
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all cursor-pointer ${
              showAdvancedFilters ? "text-purple-600 bg-purple-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            title="Filter options"
          >
            <SlidersHorizontal size={13} />
          </button>
        </div>

        {/* Quick filter buttons */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
          {channels.map((chan) => (
            <button
              key={chan}
              type="button"
              onClick={() => setActiveChannel(chan)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                activeChannel === chan
                  ? "bg-purple-600 border-purple-600 text-white shadow-2xs font-bold"
                  : "bg-white border-[#D8D8D8] text-[#666666] hover:bg-gray-100"
              }`}
            >
              {chan === "ALL" ? "All Channels" : chan}
            </button>
          ))}
        </div>

        {/* Advanced Toggles */}
        {showAdvancedFilters && (
          <div className="pt-2 border-t border-dashed border-gray-200 flex items-center gap-2 animate-in slide-in-from-top-1 duration-150">
            <button
              type="button"
              onClick={() => setFilterUnread(!filterUnread)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md border flex items-center gap-1 transition-all cursor-pointer ${
                filterUnread
                  ? "bg-purple-50 border-purple-300 text-purple-700"
                  : "bg-white border-[#D8D8D8] text-gray-500 hover:bg-gray-50"
              }`}
            >
              <CheckCheck size={11} /> Unread
            </button>
            <button
              type="button"
              onClick={() => setFilterPinned(!filterPinned)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md border flex items-center gap-1 transition-all cursor-pointer ${
                filterPinned
                  ? "bg-purple-50 border-purple-300 text-purple-700 animate-pulse"
                  : "bg-white border-[#D8D8D8] text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Pin size={11} className="rotate-45" /> Pinned
            </button>
          </div>
        )}
      </div>

      {/* Conversations Canvas Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {isLoading ? (
          renderSkeletons()
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400 px-4 space-y-2">
            <FolderOpen size={30} className="text-purple-300 stroke-[1.5]" />
            <p className="text-xs font-bold text-[#2F2F2F]">No Conversations Yet</p>
            <p className="text-[10px] max-w-xs leading-relaxed">
              Start by contacting your first lead using outbound quick actions inside the Leads Hub.
            </p>
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {pinnedConversations.length > 0 && (
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600 uppercase tracking-wider font-mono px-1">
                  <Pin size={10} className="rotate-45 fill-purple-100" />
                  <span>Pinned Conversations</span>
                </div>
                <div className="space-y-1.5">
                  {pinnedConversations.map((conv) => (
                    <ConversationCard
                      key={conv.id}
                      conversation={conv}
                      isSelected={selectedConversationId === conv.id}
                      onSelect={() => onSelectConversation(conv.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent/Standard Section */}
            <div className="space-y-2 text-left">
              {pinnedConversations.length > 0 && (
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono px-1 pt-1">
                  <span>Recent Conversations</span>
                </div>
              )}
              <div className="space-y-1.5">
                {recentConversations.map((conv) => (
                  <ConversationCard
                    key={conv.id}
                    conversation={conv}
                    isSelected={selectedConversationId === conv.id}
                    onSelect={() => onSelectConversation(conv.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

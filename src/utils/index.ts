/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LeadStatus, TaskPriority } from "../types";

/**
 * Merges class names safely, combining Tailwind classes correctly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a currency string (e.g., $15,000)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats an ISO date string into a highly readable user-friendly string
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return isoString;
  }
}

/**
 * Formats an ISO date string into a readable short date-time string
 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (e) {
    return isoString;
  }
}

/**
 * Returns dynamic color classes based on AI Lead Confidence Score
 */
export function getConfidenceColor(score: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (score >= 85) {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    };
  }
  if (score >= 60) {
    return {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    };
  }
  if (score >= 40) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    };
  }
  return {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  };
}

/**
 * Returns Tailwind design token mappings for Lead Status badges
 */
export function getStatusStyle(status: LeadStatus): {
  bg: string;
  text: string;
  label: string;
} {
  switch (status) {
    case LeadStatus.NEW:
      return { bg: "bg-[#E5F3FC]", text: "text-[#1C75BC]", label: "New" };
    case LeadStatus.CALLED:
      return { bg: "bg-[#E2F0FD]", text: "text-[#0A66C2]", label: "Called" };
    case LeadStatus.NO_ANSWER:
      return { bg: "bg-[#FFF0F0]", text: "text-[#D32F2F]", label: "No Answer" };
    case LeadStatus.INTERESTED:
      return { bg: "bg-[#E8F5E9]", text: "text-[#2E7D32]", label: "Interested" };
    case LeadStatus.WHATSAPP_SENT:
      return { bg: "bg-[#E8F8F0]", text: "text-[#075E54]", label: "WhatsApp Sent" };
    case LeadStatus.FOLLOW_UP:
      return { bg: "bg-[#FCF3E3]", text: "text-[#D97706]", label: "Follow Up" };
    case LeadStatus.MEETING:
      return { bg: "bg-[#EEF2F6]", text: "text-[#475569]", label: "Meeting" };
    case LeadStatus.PROPOSAL:
      return { bg: "bg-[#F6E8FC]", text: "text-[#8E44AD]", label: "Proposal" };
    case LeadStatus.NEGOTIATION:
      return { bg: "bg-[#E6F0FA]", text: "text-[#2980B9]", label: "Negotiation" };
    case LeadStatus.CLOSED_WON:
      return { bg: "bg-[#E6F4EA]", text: "text-[#137333]", label: "Closed Won 🎉" };
    case LeadStatus.CLOSED_LOST:
      return { bg: "bg-[#FCE8E6]", text: "text-[#C5221F]", label: "Closed Lost" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800", label: "Unknown" };
  }
}

/**
 * Returns Tailwind design token mappings for Task Priority badges
 */
export function getPriorityStyle(priority: TaskPriority): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (priority) {
    case TaskPriority.HIGH:
      return { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" };
    case TaskPriority.MEDIUM:
      return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
    case TaskPriority.LOW:
      return { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" };
    default:
      return { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" };
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Flame,
  Award,
  Clock,
  Calendar,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  Plus,
  Save,
  ChevronRight,
  ChevronLeft,
  Settings,
  Sparkles,
  User,
  Activity,
  Check,
  X,
  Volume2,
  Trash2,
  RefreshCw,
  MessageSquare,
  Building,
  DollarSign
} from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import {
  Lead,
  LeadStatus,
  Task,
  TaskPriority,
  TaskStatus,
  ActivityType,
  ActivityLog,
  PlannerItem,
  PlannerTaskType,
  PlannerTaskStatus,
  StreakData,
  Achievement,
  PlannerPreferences
} from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency, formatDate } from "../../utils";
import { motion, AnimatePresence } from "motion/react";

interface TodayViewProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activities: ActivityLog[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onOpenLeadDetails?: (lead: Lead) => void;
}

// Custom simple particle interface for celebrating achievements without external dependencies
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
}

export const TodayView: React.FC<TodayViewProps> = ({
  leads,
  setLeads,
  tasks,
  setTasks,
  activities,
  setActivities,
  onOpenLeadDetails
}) => {
  const { user } = useAuth();
  const todayDateString = new Date().toISOString().split("T")[0];

  // -----------------------------------------------------------------
  // SYSTEM LOCAL STORAGE STATE INITIALIZERS
  // -----------------------------------------------------------------
  
  // 1. Planner Preferences State
  const [prefs, setPrefs] = useState<PlannerPreferences>(() => {
    const saved = localStorage.getItem("synity_planner_prefs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return { newLeadsTarget: 5, hasCompletedSetup: false };
  });

  // 2. Custom Custom Lead Target Field
  const [customTargetInput, setCustomTargetInput] = useState("");
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);

  // 3. Planner Items State
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>([]);

  // 4. Streak Tracker State
  const [streak, setStreak] = useState<StreakData>(() => {
    const saved = localStorage.getItem("synity_planner_streak");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      dailyCompletion: 0,
      weeklyCompletion: 0,
      currentStreak: 3, // Seeding 3 days for mock engagement
      longestStreak: 5
    };
  });

  // 5. Achievements State
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("synity_planner_achievements");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: "ach-1", title: "First Follow Up", description: "Successfully complete your first client check-in task.", unlocked: true, unlockedAt: new Date().toISOString(), icon: "Phone" },
      { id: "ach-2", title: "100 Calls", description: "Log 100 total calling segments inside CRM database.", unlocked: false, icon: "Phone" },
      { id: "ach-3", title: "7 Day Streak", description: "Maintain a flawless 100% daily schedule completion for 7 days.", unlocked: false, icon: "Flame" },
      { id: "ach-4", title: "First Closed Deal", description: "Transition your first hot lead to Closed Won status.", unlocked: false, icon: "Trophy" },
      { id: "ach-5", title: "Perfect Follow Up", description: "Never allow a follow-up scheduled to turn overdue.", unlocked: true, unlockedAt: new Date().toISOString(), icon: "Award" }
    ];
  });

  // 6. Active Focus Mode Workday flow state
  const [activeWorkspaceItemIndex, setActiveWorkspaceItemIndex] = useState<number | null>(null);
  const [quickNoteText, setQuickNoteText] = useState("");
  const [selectedRescheduleDate, setSelectedRescheduleDate] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");

  // 7. Yesterday unfinished review trigger state
  const [unfinishedLeadsToReview, setUnfinishedLeadsToReview] = useState<Lead[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // 8. Custom Confetti particle lists for celebrations
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  // 9. Selected customized view filter: "ALL" | "TODO" | "DONE"
  const [itemFilter, setItemFilter] = useState<"ALL" | "TODO" | "DONE">("ALL");

  // -----------------------------------------------------------------
  // CORE TIMERS AND LIVE TICK COUNTER (Callback Countdown)
  // -----------------------------------------------------------------
  const [currentTime, setCurrentTime] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000); // tick every 10s
    return () => clearInterval(timer);
  }, []);

  // -----------------------------------------------------------------
  // GENERATE / RE-GENERATE WORKDAY ENGINE
  // -----------------------------------------------------------------
  const triggerConfetti = () => {
    const newParticles: ConfettiParticle[] = [];
    const colors = ["#FFD700", "#FF4500", "#1E90FF", "#32CD32", "#FF69B4", "#8A2BE2"];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: 40 + Math.random() * 20, // percentage from left
        y: 80, // starts low
        size: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI - Math.PI / 2, // upwards arc
        speed: 4 + Math.random() * 6
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2500); // clear
  };

  const savePrefs = (newPrefs: PlannerPreferences) => {
    setPrefs(newPrefs);
    localStorage.setItem("synity_planner_prefs", JSON.stringify(newPrefs));
  };

  const saveStreak = (newStreak: StreakData) => {
    setStreak(newStreak);
    localStorage.setItem("synity_planner_streak", JSON.stringify(newStreak));
  };

  const saveAchievements = (newAchievements: Achievement[]) => {
    setAchievements(newAchievements);
    localStorage.setItem("synity_planner_achievements", JSON.stringify(newAchievements));
  };

  // Build / compile today's workplan
  const generateTodayPlan = (targetNewLeadsCount: number, forceClean = false) => {
    // Check if we already have items generated for today in localStorage
    const savedItems = localStorage.getItem(`synity_planner_items_${todayDateString}`);
    if (savedItems && !forceClean) {
      try {
        const parsed = JSON.parse(savedItems);
        if (parsed.length > 0) {
          setPlannerItems(parsed);
          return;
        }
      } catch (e) {
        // Fallback
      }
    }

    // Otherwise compile a fresh list following:
    // Priority order:
    // 1. Meetings
    // 2. Overdue Follow Ups
    // 3. Today's Follow Ups
    // 4. Callbacks
    // 5. Pending Proposals
    // 6. New Leads (adjusted by workload balancer)

    const compiledItems: PlannerItem[] = [];

    // Category 1: Meetings (from tasks containing Meeting or leads in MEETING stage)
    const meetingTasks = tasks.filter(
      t => (t.title.toLowerCase().includes("meeting") || t.title.toLowerCase().includes("sync")) && t.status !== TaskStatus.DONE
    );
    meetingTasks.forEach(t => {
      const parentLead = leads.find(l => l.id === t.leadId);
      compiledItems.push({
        id: `plan-meeting-${t.id}`,
        type: PlannerTaskType.MEETING,
        title: `📅 Client Sync: ${t.title}`,
        description: t.description || "In-person or virtual sync scheduled for today.",
        leadId: t.leadId,
        leadName: t.leadName || parentLead?.name || "Unspecified",
        companyName: parentLead?.company || "Direct Client",
        estimatedMinutes: 30,
        status: PlannerTaskStatus.TODO,
        priority: "URGENT",
        scheduledTime: t.dueDate
      });
    });

    // Category 2 & 3: Follow Ups (Overdue & Today)
    const nowISO = new Date().toISOString();
    const todayStr = todayDateString;

    leads.forEach(l => {
      if (!l.nextFollowUp || l.status === LeadStatus.CLOSED_WON || l.status === LeadStatus.CLOSED_LOST) return;

      const followDateStr = l.nextFollowUp.split("T")[0];
      const isOverdue = l.nextFollowUp < nowISO && followDateStr !== todayStr;
      const isToday = followDateStr === todayStr;

      if (isOverdue) {
        compiledItems.push({
          id: `plan-overdue-${l.id}`,
          type: PlannerTaskType.FOLLOW_UP,
          title: `⚠️ Overdue Follow Up: ${l.company}`,
          description: `Crucial check-in overdue since ${formatDate(l.nextFollowUp)}. Standardize proposal parameters.`,
          leadId: l.id,
          leadName: l.name,
          companyName: l.company,
          estimatedMinutes: 15,
          status: PlannerTaskStatus.TODO,
          priority: "URGENT",
          scheduledTime: l.nextFollowUp
        });
      } else if (isToday) {
        compiledItems.push({
          id: `plan-today-follow-${l.id}`,
          type: PlannerTaskType.FOLLOW_UP,
          title: `💬 Scheduled Follow Up: ${l.company}`,
          description: `Reconnect with ${l.name} to advance pipeline stage.`,
          leadId: l.id,
          leadName: l.name,
          companyName: l.company,
          estimatedMinutes: 15,
          status: PlannerTaskStatus.TODO,
          priority: "HIGH",
          scheduledTime: l.nextFollowUp
        });
      }
    });

    // Category 4: Callbacks (Leads in NO_ANSWER status)
    const callbackLeads = leads.filter(l => l.status === LeadStatus.NO_ANSWER);
    callbackLeads.forEach(l => {
      // Check if we didn't already add it as a follow-up
      if (compiledItems.some(i => i.leadId === l.id && i.type === PlannerTaskType.FOLLOW_UP)) return;
      compiledItems.push({
        id: `plan-callback-${l.id}`,
        type: PlannerTaskType.CALLBACK,
        title: `📞 Outbound Callback: ${l.company}`,
        description: `No answer logged during previous dial session. Connect again with ${l.name} to seal terms.`,
        leadId: l.id,
        leadName: l.name,
        companyName: l.company,
        estimatedMinutes: 10,
        status: PlannerTaskStatus.TODO,
        priority: "MEDIUM",
        scheduledTime: l.nextFollowUp || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours out
      });
    });

    // Category 5: Pending Proposals (Leads in PROPOSAL stage)
    const proposalLeads = leads.filter(l => l.status === LeadStatus.PROPOSAL);
    proposalLeads.forEach(l => {
      if (compiledItems.some(i => i.leadId === l.id)) return;
      compiledItems.push({
        id: `plan-proposal-${l.id}`,
        type: PlannerTaskType.PROPOSAL,
        title: `📄 Seal Proposal: ${l.company}`,
        description: `Proposal draft active. Send reminder notes or clarify contract margins.`,
        leadId: l.id,
        leadName: l.name,
        companyName: l.company,
        estimatedMinutes: 20,
        status: PlannerTaskStatus.TODO,
        priority: "HIGH",
        scheduledTime: l.updatedAt
      });
    });

    // -----------------------------------------------------------------
    // WORKLOAD BALANCER LOGIC
    // -----------------------------------------------------------------
    const activeDemandsCount = compiledItems.length;
    let actualNewLeadsToAssign = targetNewLeadsCount;

    if (activeDemandsCount >= 8) {
      // Extremely busy. No new leads or capped at 1
      actualNewLeadsToAssign = Math.min(1, targetNewLeadsCount);
    } else if (activeDemandsCount >= 5) {
      // Moderately busy. Cap target to half or reduce
      actualNewLeadsToAssign = Math.min(2, targetNewLeadsCount);
    } else if (activeDemandsCount >= 3) {
      actualNewLeadsToAssign = Math.min(3, targetNewLeadsCount);
    }

    // Select eligible new leads (Leads in NEW stage that aren't already included)
    const newLeads = leads.filter(l => l.status === LeadStatus.NEW && !compiledItems.some(i => i.leadId === l.id));
    const selectedNewLeads = newLeads.slice(0, actualNewLeadsToAssign);

    selectedNewLeads.forEach(l => {
      compiledItems.push({
        id: `plan-new-${l.id}`,
        type: PlannerTaskType.NEW_LEAD,
        title: `✨ Contact New Prospect: ${l.company}`,
        description: `Qualify outbound prospect ${l.name}. Source: ${l.source}. Value: ${formatCurrency(l.value)}.`,
        leadId: l.id,
        leadName: l.name,
        companyName: l.company,
        estimatedMinutes: 10,
        status: PlannerTaskStatus.TODO,
        priority: "MEDIUM"
      });
    });

    // Category 6: Generic TODO tasks not linked to specific leads, or linked but simple
    const genericTasks = tasks.filter(
      t => !t.title.toLowerCase().includes("meeting") && !t.title.toLowerCase().includes("sync") && t.status !== TaskStatus.DONE
    );
    genericTasks.forEach(t => {
      if (compiledItems.some(i => i.title.includes(t.title))) return;
      compiledItems.push({
        id: `plan-task-${t.id}`,
        type: PlannerTaskType.TASK,
        title: `📝 CRM Action: ${t.title}`,
        description: t.description || "Action item assigned on today's workspace log.",
        leadId: t.leadId,
        leadName: t.leadName,
        estimatedMinutes: 15,
        status: PlannerTaskStatus.TODO,
        priority: t.priority === TaskPriority.HIGH ? "HIGH" : t.priority === TaskPriority.MEDIUM ? "MEDIUM" : "LOW",
        scheduledTime: t.dueDate
      });
    });

    setPlannerItems(compiledItems);
    localStorage.setItem(`synity_planner_items_${todayDateString}`, JSON.stringify(compiledItems));
  };

  // Automatically compile on mount if preference is completed
  useEffect(() => {
    if (prefs.hasCompletedSetup) {
      generateTodayPlan(prefs.newLeadsTarget);
    }
  }, [prefs.hasCompletedSetup, leads, tasks]);

  // Check for yesterday review items (Unfinished planner items from older days)
  useEffect(() => {
    if (!prefs.hasCompletedSetup) return;

    // Simulate scanning older planner sessions
    const keys = Object.keys(localStorage);
    const olderPlannerKeys = keys.filter(
      k => k.startsWith("synity_planner_items_") && !k.endsWith(todayDateString)
    );

    if (olderPlannerKeys.length > 0) {
      // Find unfinished items from previous sessions
      const itemsToReview: Lead[] = [];
      olderPlannerKeys.forEach(key => {
        try {
          const items = JSON.parse(localStorage.getItem(key) || "[]") as PlannerItem[];
          items.forEach(item => {
            if (item.status === PlannerTaskStatus.TODO && item.leadId) {
              const leadObj = leads.find(l => l.id === item.leadId);
              if (leadObj && !itemsToReview.some(l => l.id === leadObj.id)) {
                itemsToReview.push(leadObj);
              }
            }
          });
        } catch (e) {
          // ignore
        }
      });

      if (itemsToReview.length > 0) {
        setUnfinishedLeadsToReview(itemsToReview.slice(0, 5)); // cap at 5 for ease of UX
        setIsReviewOpen(true);
      }
    }
  }, [prefs.hasCompletedSetup]);

  // Save current planner state whenever it changes
  const saveCurrentPlannerItemsState = (items: PlannerItem[]) => {
    setPlannerItems(items);
    localStorage.setItem(`synity_planner_items_${todayDateString}`, JSON.stringify(items));

    // Dynamic state update of streaks & analytics
    const completed = items.filter(i => i.status === PlannerTaskStatus.DONE).length;
    const total = items.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const updatedStreak = {
      ...streak,
      dailyCompletion: completionRate,
      weeklyCompletion: Math.min(100, Math.round((streak.weeklyCompletion + completionRate) / 2))
    };
    saveStreak(updatedStreak);
  };

  // -----------------------------------------------------------------
  // HANDLERS FOR FIRST TIME PREFERENCES
  // -----------------------------------------------------------------
  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = customTargetInput ? parseInt(customTargetInput, 10) : 5;
    if (isNaN(value) || value <= 0) return;

    savePrefs({
      newLeadsTarget: value,
      hasCompletedSetup: true
    });
    setIsEditingPrefs(false);
    generateTodayPlan(value, true);
    triggerConfetti();
  };

  const startSetupFlow = (selected: number) => {
    savePrefs({
      newLeadsTarget: selected,
      hasCompletedSetup: true
    });
    generateTodayPlan(selected, true);
    triggerConfetti();
  };

  // -----------------------------------------------------------------
  // END OF DAY YESTERDAY REVIEW HANDLERS
  // -----------------------------------------------------------------
  const handleYesterdayReviewResolve = (leadId: string, action: LeadStatus | "CALL_AGAIN" | "LOST") => {
    // 1. Update lead status in state
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          let updatedStatus = l.status;
          let updatedNotes = l.notes || "";
          if (action === "CALL_AGAIN") {
            updatedStatus = LeadStatus.CALLED;
            updatedNotes += `\n[Yesterday Review]: Re-queued dialer session.`;
          } else if (action === "LOST") {
            updatedStatus = LeadStatus.CLOSED_LOST;
            updatedNotes += `\n[Yesterday Review]: Checked out lost. Reason: Budget Shifting.`;
          } else {
            updatedStatus = action as LeadStatus;
          }

          return {
            ...l,
            status: updatedStatus,
            notes: updatedNotes,
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      })
    );

    // 2. Create activity log
    const leadObj = leads.find(l => l.id === leadId);
    const act: ActivityLog = {
      id: `act-review-${Date.now()}`,
      leadId: leadId,
      leadName: leadObj?.name || "Client",
      type: ActivityType.STATE_CHANGE,
      title: "Yesterday Backlog Evaluated ♻️",
      description: `Backlog review complete. Strategy updated: ${action}`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    // 3. Remove resolved lead from the review queue
    setUnfinishedLeadsToReview(prev => {
      const remaining = prev.filter(l => l.id !== leadId);
      if (remaining.length === 0) {
        setIsReviewOpen(false);
        // Clear all historical keys to avoid annoying repeating prompt
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
          if (k.startsWith("synity_planner_items_") && !k.endsWith(todayDateString)) {
            localStorage.removeItem(k);
          }
        });
        // Build today's target with fresh plan
        generateTodayPlan(prefs.newLeadsTarget, true);
        triggerConfetti();
        alert("Flawless! Yesterday review archived. Today's workspace initialized.");
      }
      return remaining;
    });
  };

  // -----------------------------------------------------------------
  // ACTIVE WORKDAY TASK ACTION CODES (GUIDED FLOW)
  // -----------------------------------------------------------------
  const getActiveItem = (): PlannerItem | null => {
    if (activeWorkspaceItemIndex === null) return null;
    return plannerItems[activeWorkspaceItemIndex] || null;
  };

  const activeItem = getActiveItem();
  const linkedLead = activeItem && activeItem.leadId ? leads.find(l => l.id === activeItem.leadId) : null;

  const navigateNextTask = () => {
    if (activeWorkspaceItemIndex === null) return;
    
    // Find next uncompleted item
    const nextIndex = plannerItems.findIndex(
      (item, idx) => idx > activeWorkspaceItemIndex && item.status === PlannerTaskStatus.TODO
    );

    if (nextIndex !== -1) {
      setActiveWorkspaceItemIndex(nextIndex);
      setQuickNoteText("");
      setSelectedRescheduleDate("");
      setRescheduleError("");
    } else {
      // Scan from start
      const wrapIndex = plannerItems.findIndex(item => item.status === PlannerTaskStatus.TODO);
      if (wrapIndex !== -1 && wrapIndex !== activeWorkspaceItemIndex) {
        setActiveWorkspaceItemIndex(wrapIndex);
        setQuickNoteText("");
        setSelectedRescheduleDate("");
        setRescheduleError("");
      } else {
        // Complete! Exit workspace
        setActiveWorkspaceItemIndex(null);
        triggerConfetti();
        
        // Unlock Streak Achievements if all done
        const hasUncompleted = plannerItems.some(i => i.status === PlannerTaskStatus.TODO);
        if (!hasUncompleted) {
          const updatedStreak = {
            ...streak,
            currentStreak: streak.currentStreak + 1,
            longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1)
          };
          saveStreak(updatedStreak);

          // Unlock streak achievement
          if (updatedStreak.currentStreak >= 4) {
            setAchievements(prev =>
              prev.map(ach => {
                if (ach.id === "ach-3" && !ach.unlocked) {
                  return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
                }
                return ach;
              })
            );
          }
        }
        alert("Stellar! You completed today's action plan. Streak updated!");
      }
    }
  };

  // Action: Skip
  const handleSkipActiveTask = () => {
    if (activeWorkspaceItemIndex === null || !activeItem) return;

    const updated = plannerItems.map((item, idx) => {
      if (idx === activeWorkspaceItemIndex) {
        return { ...item, status: PlannerTaskStatus.SKIPPED };
      }
      return item;
    });

    saveCurrentPlannerItemsState(updated);
    navigateNextTask();
  };

  // Action: Reschedule (Move to tomorrow / custom)
  const handleRescheduleActiveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeWorkspaceItemIndex === null || !activeItem) return;
    if (!selectedRescheduleDate) {
      setRescheduleError("Provide a target date to move this action.");
      return;
    }

    const targetDateISO = new Date(selectedRescheduleDate).toISOString();

    // Move nextFollowUp if linked to lead
    if (activeItem.leadId) {
      setLeads(prev =>
        prev.map(l => {
          if (l.id === activeItem.leadId) {
            return {
              ...l,
              nextFollowUp: targetDateISO,
              updatedAt: new Date().toISOString()
            };
          }
          return l;
        })
      );

      // Create activity
      const act: ActivityLog = {
        id: `act-resched-${Date.now()}`,
        leadId: activeItem.leadId,
        leadName: activeItem.leadName || "Lead",
        type: ActivityType.STATE_CHANGE,
        title: "Client Action Rescheduled 🔄",
        description: `Scheduled engagement shifted to ${formatDate(targetDateISO)} per advisor instructions.`,
        timestamp: new Date().toISOString(),
        userName: "Alex Rivers"
      };
      setActivities(prev => [act, ...prev]);
    }

    // Mark as Rescheduled
    const updated = plannerItems.map((item, idx) => {
      if (idx === activeWorkspaceItemIndex) {
        return { ...item, status: PlannerTaskStatus.RESCHEDULED, notes: `Shifted to ${formatDate(targetDateISO)}` };
      }
      return item;
    });

    saveCurrentPlannerItemsState(updated);
    navigateNextTask();
  };

  // Action: Change Status of lead inside workspace
  const handleWorkspaceChangeStatus = (newStatus: LeadStatus) => {
    if (!activeItem || !activeItem.leadId) return;

    setLeads(prev =>
      prev.map(l => {
        if (l.id === activeItem.leadId) {
          return {
            ...l,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      })
    );

    // Create activity
    const act: ActivityLog = {
      id: `act-status-ch-${Date.now()}`,
      leadId: activeItem.leadId,
      leadName: activeItem.leadName || "Lead",
      type: ActivityType.STATE_CHANGE,
      title: "Workspace Funnel Updated ♻️",
      description: `Transitioned pipeline stage directly from guided workspace to ${newStatus}.`,
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    // Check achievement unlock
    if (newStatus === LeadStatus.CLOSED_WON) {
      setAchievements(prev =>
        prev.map(ach => {
          if (ach.id === "ach-4" && !ach.unlocked) {
            return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
          }
          return ach;
        })
      );
      triggerConfetti();
    }
    alert(`Pipeline status updated to ${newStatus}.`);
  };

  // Action: Save Quick note & attach
  const handleSaveWorkspaceNote = () => {
    if (!activeItem || !activeItem.leadId || !quickNoteText.trim()) return;

    setLeads(prev =>
      prev.map(l => {
        if (l.id === activeItem.leadId) {
          return {
            ...l,
            notes: `${quickNoteText.trim()}\n\n${l.notes || ""}`,
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      })
    );

    // Log Activity
    const act: ActivityLog = {
      id: `act-note-${Date.now()}`,
      leadId: activeItem.leadId,
      leadName: activeItem.leadName || "Lead",
      type: ActivityType.NOTE,
      title: "Workspace Advisor Note logged 📝",
      description: quickNoteText.trim(),
      timestamp: new Date().toISOString(),
      userName: "Alex Rivers"
    };
    setActivities(prev => [act, ...prev]);

    setQuickNoteText("");
    alert("Advisor note pinned to client profile successfully!");
  };

  // Action: Mark Complete
  const handleCompleteActiveTask = () => {
    if (activeWorkspaceItemIndex === null || !activeItem) return;

    // Simulate update depending on type
    if (activeItem.leadId) {
      // Transition NEW to CALLED or general progression
      setLeads(prev =>
        prev.map(l => {
          if (l.id === activeItem.leadId) {
            let nextStatus = l.status;
            if (l.status === LeadStatus.NEW) nextStatus = LeadStatus.CALLED;
            else if (l.status === LeadStatus.CALLED || l.status === LeadStatus.NO_ANSWER) nextStatus = LeadStatus.FOLLOW_UP;

            return {
              ...l,
              status: nextStatus,
              lastContactedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
          return l;
        })
      );

      // Create completion log
      const act: ActivityLog = {
        id: `act-comp-${Date.now()}`,
        leadId: activeItem.leadId,
        leadName: activeItem.leadName || "Lead",
        type: ActivityType.CALL,
        title: "Workday Task Resolved ✅",
        description: `Action item: "${activeItem.title}" marked as accomplished. Contacts calibrated.`,
        timestamp: new Date().toISOString(),
        userName: "Alex Rivers"
      };
      setActivities(prev => [act, ...prev]);
    }

    // Update Planner Item Status
    const updated = plannerItems.map((item, idx) => {
      if (idx === activeWorkspaceItemIndex) {
        return { ...item, status: PlannerTaskStatus.DONE, completedAt: new Date().toISOString() };
      }
      return item;
    });

    saveCurrentPlannerItemsState(updated);
    
    // Unlock achievements
    setAchievements(prev =>
      prev.map(ach => {
        if (ach.id === "ach-1" && !ach.unlocked) {
          return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return ach;
      })
    );

    navigateNextTask();
  };

  // Start Day button trigger
  const handleStartMyDayFlow = () => {
    const firstTodoIdx = plannerItems.findIndex(i => i.status === PlannerTaskStatus.TODO);
    if (firstTodoIdx !== -1) {
      setActiveWorkspaceItemIndex(firstTodoIdx);
      setQuickNoteText("");
      setSelectedRescheduleDate("");
      setRescheduleError("");
    } else {
      alert("All tasks are already completed for today! Awesome job!");
    }
  };

  // Reset planner entirely (re-generate)
  const handleReGeneratePlanner = () => {
    if (window.confirm("Re-generating today's plan will discard skips/notes logged. Proceed?")) {
      generateTodayPlan(prefs.newLeadsTarget, true);
    }
  };

  // -----------------------------------------------------------------
  // COMPUTE METRICS & BRIEFINGS
  // -----------------------------------------------------------------
  const countByType = (type: PlannerTaskType) => plannerItems.filter(i => i.type === type).length;
  const countDoneByType = (type: PlannerTaskType) => plannerItems.filter(i => i.type === type && i.status === PlannerTaskStatus.DONE).length;

  const totalItemCount = plannerItems.length;
  const completedCount = plannerItems.filter(i => i.status === PlannerTaskStatus.DONE).length;
  const skippedCount = plannerItems.filter(i => i.status === PlannerTaskStatus.SKIPPED).length;
  const rescheduledCount = plannerItems.filter(i => i.status === PlannerTaskStatus.RESCHEDULED).length;
  const remainingCount = plannerItems.filter(i => i.status === PlannerTaskStatus.TODO).length;

  const completionPercentage = totalItemCount > 0 ? Math.round((completedCount / totalItemCount) * 100) : 0;

  // Calculate estimated duration (minutes remaining)
  const calculateEstimatedMinutes = () => {
    return plannerItems
      .filter(i => i.status === PlannerTaskStatus.TODO)
      .reduce((sum, item) => sum + item.estimatedMinutes, 0);
  };

  const estimatedMinutesLeft = calculateEstimatedMinutes();
  const estimatedHours = Math.floor(estimatedMinutesLeft / 60);
  const estimatedMinutesRem = estimatedMinutesLeft % 60;
  const estimatedTimeString =
    estimatedMinutesLeft > 0
      ? `${estimatedHours > 0 ? `${estimatedHours}h ` : ""}${estimatedMinutesRem}m`
      : "0m";

  // Filter list display
  const getFilteredItems = () => {
    return plannerItems.filter(item => {
      if (itemFilter === "TODO") return item.status === PlannerTaskStatus.TODO;
      if (itemFilter === "DONE") return item.status === PlannerTaskStatus.DONE;
      return true; // ALL
    });
  };

  // -----------------------------------------------------------------
  // RENDER SCREEN SECTIONS
  // -----------------------------------------------------------------

  // Screen A: Setup screen if user hasn't completed setup
  if (!prefs.hasCompletedSetup) {
    return (
      <div className="max-w-xl mx-auto my-12 text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 border border-[#D8D8D8] bg-white space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-[#4E4E49] rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                <Sparkles size={22} className="animate-pulse" />
              </div>
              <h2 className="text-xl font-extrabold font-display text-[#2F2F2F]">Configure Your Sales Engine</h2>
              <p className="text-xs text-[#666666]">
                Synity prioritizes client segments and automatically assigns fresh outbound targets. Tell us your ideal target.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
                How many NEW prospects do you want to contact daily?
              </label>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[5, 10, 15, 20].map(val => (
                  <button
                    key={val}
                    onClick={() => startSetupFlow(val)}
                    className="p-4 border border-[#D8D8D8] rounded-xl font-bold bg-slate-50 text-[#2F2F2F] hover:border-[#4E4E49] hover:bg-[#E5E3E7]/35 transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer"
                  >
                    <strong className="text-base font-mono">{val} Leads</strong>
                    <span className="text-[10px] font-normal text-gray-400">Outbound Qualify</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-[#F2F2F2] pt-4">
                <form onSubmit={handleSetupSubmit} className="flex gap-2.5 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="block text-[9px] font-bold text-gray-400 uppercase font-mono">Or enter customized goal</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      placeholder="e.g. 8"
                      value={customTargetInput}
                      onChange={e => setCustomTargetInput(e.target.value)}
                      className="w-full bg-[#E5E3E7]/20 border border-[#D8D8D8] rounded-lg px-3 py-2 text-xs outline-none text-[#2F2F2F]"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="py-2 px-4 h-9">
                    Set Target
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Screen B: Immersive Focus Mode workspace overlay if task is active
  if (activeWorkspaceItemIndex !== null && activeItem) {
    return (
      <div className="min-h-[500px] text-left">
        {/* Custom particle canvas animation overlay for unlocked milestones */}
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                left: `${p.x}%`,
                top: `${p.y}%`
              }}
              animate={{
                x: Math.cos(p.angle) * p.speed * 40,
                y: -Math.abs(Math.sin(p.angle) * p.speed * 80),
                opacity: [1, 0]
              }}
              transition={{ duration: 2.2, ease: "easeOut" }}
            />
          ))}
        </div>

        {/* Focus Mode Workspace Panel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D8D8D8] pb-4">
            <button
              onClick={() => setActiveWorkspaceItemIndex(null)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-slate-800 transition-colors font-bold font-mono"
            >
              <ChevronLeft size={14} />
              EXIT CONTEXT WORKSPACE
            </button>

            <div className="flex items-center gap-2.5 text-xs">
              <span className="font-mono text-gray-400 font-bold uppercase">
                Task {activeWorkspaceItemIndex + 1} of {totalItemCount}
              </span>
              <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((activeWorkspaceItemIndex + 1) / totalItemCount) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMN 1: CLIENT FILE (LEFT SIDE - 7/12) */}
            <div className="lg:col-span-7 space-y-5">
              <Card className="p-5 border border-[#D8D8D8] bg-white space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 text-left">
                    <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                      Active Focal Client
                    </span>
                    <h3 className="text-base font-black text-[#2F2F2F] tracking-tight flex items-center gap-2">
                      <Building size={16} className="text-gray-400" />
                      {activeItem.companyName || "Direct Contact"}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">Contact Name: {activeItem.leadName || "None logged"}</p>
                  </div>

                  <Badge
                    variant={activeItem.priority === "URGENT" ? "primary" : "secondary"}
                    className={`uppercase font-mono font-bold text-[9px] ${
                      activeItem.priority === "URGENT"
                        ? "bg-rose-500 text-white"
                        : activeItem.priority === "HIGH"
                        ? "bg-amber-500 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {activeItem.priority} PRIORITY
                  </Badge>
                </div>

                {linkedLead ? (
                  <div className="grid grid-cols-2 gap-4 text-xs border-y border-[#F2F2F2] py-4">
                    <div className="space-y-1">
                      <span className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Estimated Deal Value</span>
                      <strong className="text-gray-800 font-mono text-sm">{formatCurrency(linkedLead.value)}</strong>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Origin Channel</span>
                      <strong className="text-gray-800 font-sans text-xs">{linkedLead.source}</strong>
                    </div>
                    {linkedLead.phone && (
                      <div className="space-y-1">
                        <span className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Telephone</span>
                        <strong className="text-blue-600 font-mono text-xs">{linkedLead.phone}</strong>
                      </div>
                    )}
                    {linkedLead.email && (
                      <div className="space-y-1 text-left truncate">
                        <span className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Email Contact</span>
                        <strong className="text-gray-700 font-mono text-xs">{linkedLead.email}</strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-gray-500">
                    This task is a system-wide action and is not connected to any external company file.
                  </div>
                )}

                <div className="space-y-2 text-left">
                  <h4 className="text-xs font-bold text-gray-600 font-mono uppercase tracking-wider">Action Parameters</h4>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
                    <h5 className="font-extrabold text-[#2F2F2F]">{activeItem.title}</h5>
                    <p className="text-gray-500 leading-relaxed text-[11px] font-medium">{activeItem.description}</p>
                  </div>
                </div>

                {linkedLead && linkedLead.notes && (
                  <div className="space-y-1.5 text-left text-xs border-t border-[#F2F2F2] pt-4">
                    <h4 className="text-xs font-bold text-gray-600 font-mono uppercase tracking-wider">Internal Lead Logs</h4>
                    <p className="text-gray-500 leading-relaxed bg-[#E5E3E7]/10 p-3 rounded-lg border border-[#D8D8D8]/40 max-h-[140px] overflow-y-auto whitespace-pre-line text-[11px]">
                      {linkedLead.notes}
                    </p>
                  </div>
                )}
              </Card>

              {/* QUICK NOTES ON ACTIVE ACTION */}
              {linkedLead && (
                <Card className="p-4 border border-[#D8D8D8] bg-white space-y-3 text-xs text-left">
                  <h4 className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 font-mono text-[10px]">
                    <Save size={13} className="text-blue-500" />
                    Interactive Workday Notepad
                  </h4>
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={quickNoteText}
                      onChange={e => setQuickNoteText(e.target.value)}
                      placeholder="Add pain points, callback commitments, or negotiated pricing..."
                      className="block w-full rounded-lg border border-[#D8D8D8] p-2.5 text-xs text-[#2F2F2F] leading-normal outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 resize-none bg-slate-50/50"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!quickNoteText.trim()}
                        onClick={handleSaveWorkspaceNote}
                        className="py-1.5 font-bold flex items-center gap-1"
                      >
                        <Plus size={12} />
                        Attach To Lead File
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* COLUMN 2: WORK ACTIONS (RIGHT SIDE - 5/12) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Core completion operations */}
              <Card className="p-5 border border-[#D8D8D8] bg-white space-y-4">
                <h4 className="text-xs font-bold text-[#2F2F2F] font-mono uppercase tracking-wider">Task Resolution Workspace</h4>

                {/* Scheduled Call Countdown alarm */}
                {activeItem.scheduledTime && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                    <Clock size={16} className="text-amber-600 animate-spin" />
                    <div className="space-y-0.5 text-xs text-left">
                      <span className="block text-[8px] uppercase font-bold text-amber-600 font-mono">Countdown Alarm</span>
                      <strong className="text-[#2F2F2F] font-extrabold font-mono text-[11px]">
                        {(() => {
                          const diff = new Date(activeItem.scheduledTime).getTime() - currentTime.getTime();
                          if (diff < 0) {
                            return "Overdue - Action needed immediately!";
                          }
                          const hrs = Math.floor(diff / (1000 * 60 * 60));
                          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          return `In ${hrs > 0 ? `${hrs}h ` : ""}${mins} Minutes`;
                        })()}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleCompleteActiveTask}
                    className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs bg-[#4E4E49] hover:bg-[#2F2F2F] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    Mark Task Complete
                  </button>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={handleSkipActiveTask}
                      className="py-2.5 px-3 border border-[#D8D8D8] rounded-xl font-bold text-[#666666] hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 bg-white cursor-pointer"
                    >
                      <XCircle size={14} />
                      Skip For Now
                    </button>

                    <button
                      onClick={() => setSelectedRescheduleDate(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0])}
                      className="py-2.5 px-3 border border-[#D8D8D8] rounded-xl font-bold text-amber-700 hover:bg-amber-50/50 border-amber-200/50 transition-colors flex items-center justify-center gap-1.5 bg-amber-50/20 cursor-pointer"
                    >
                      <Calendar size={14} />
                      Move Tomorrow
                    </button>
                  </div>
                </div>

                {/* Advanced lead stage transitions inside workflow */}
                {linkedLead && (
                  <div className="space-y-2 border-t border-[#F2F2F2] pt-4 text-left">
                    <label className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Transition Pipeline Status</label>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      {[
                        { label: "Interested", status: LeadStatus.INTERESTED },
                        { label: "WhatsApp Sent", status: LeadStatus.WHATSAPP_SENT },
                        { label: "Follow Up", status: LeadStatus.FOLLOW_UP },
                        { label: "Proposal Sent", status: LeadStatus.PROPOSAL },
                        { label: "Negotiation", status: LeadStatus.NEGOTIATION },
                        { label: "Closed Won 🎉", status: LeadStatus.CLOSED_WON },
                        { label: "Closed Lost", status: LeadStatus.CLOSED_LOST }
                      ].map(stage => (
                        <button
                          key={stage.status}
                          type="button"
                          onClick={() => handleWorkspaceChangeStatus(stage.status)}
                          className={`px-2 py-2 rounded-lg border font-bold text-center transition-all cursor-pointer ${
                            linkedLead.status === stage.status
                              ? "bg-slate-100 border-[#666666] text-[#2F2F2F]"
                              : "bg-white border-[#D8D8D8] text-gray-600 hover:bg-slate-50"
                          }`}
                        >
                          {stage.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Custom Reschedule Selector Form */}
              <Card className="p-4 border border-[#D8D8D8] bg-white text-left space-y-3.5">
                <h4 className="text-xs font-bold text-[#2F2F2F] font-mono uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw size={13} className="text-amber-500" />
                  Custom Reschedule Date
                </h4>
                <form onSubmit={handleRescheduleActiveTask} className="space-y-2.5 text-xs">
                  <input
                    type="date"
                    required
                    value={selectedRescheduleDate}
                    onChange={e => {
                      setSelectedRescheduleDate(e.target.value);
                      setRescheduleError("");
                    }}
                    className="block w-full bg-slate-50 border border-[#D8D8D8] rounded-lg px-3 py-2 outline-none text-[#2F2F2F] text-xs font-mono"
                  />
                  {rescheduleError && <p className="text-[10px] text-rose-600 font-semibold">{rescheduleError}</p>}
                  <Button type="submit" variant="outline" size="sm" className="w-full py-2 font-bold">
                    Reschedule Event
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* 1. HERO PLANNER HEADER AND SUMMARY BRIEFING */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 border border-[#D8D8D8] rounded-2xl relative overflow-hidden">
        <div className="space-y-1.5 z-10 text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#4E4E49] text-white rounded-lg">
              <Sparkles size={14} className="animate-pulse" />
            </span>
            <h2 className="text-lg font-black font-display text-[#2F2F2F] tracking-tight">AI Daily Workday Planner</h2>
          </div>
          <p className="text-xs text-[#666666] leading-relaxed max-w-xl">
            Synity filters noise out of CRM backlogs. Combining meetings, callbacks, and fresh target qualified prospects into an automated daily mission focus.
          </p>
        </div>

        {/* Start My Day & preferences button trigger */}
        <div className="flex items-center gap-2.5 z-10">
          <button
            onClick={() => setIsEditingPrefs(true)}
            className="p-2.5 rounded-xl border border-[#D8D8D8] text-gray-500 hover:text-[#2F2F2F] bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Adjust Daily target leads"
          >
            <Settings size={15} />
          </button>
          <button
            onClick={handleStartMyDayFlow}
            disabled={remainingCount === 0}
            className={`px-5 py-3 rounded-xl font-bold text-xs text-white shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              remainingCount === 0
                ? "bg-slate-400 cursor-not-allowed opacity-50"
                : "bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5"
            }`}
          >
            <Play size={13} fill="white" />
            START MY DAY
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC WORKLOAD BALANCER ADVISOR BANNER */}
      <div className="p-4 bg-gradient-to-tr from-[#E5E3E7]/40 to-[#8CB9D7]/10 border border-[#D8D8D8]/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
        <div className="flex items-start gap-2.5 text-left leading-normal">
          <Sparkles size={16} className="text-[#8CB9D7] shrink-0 mt-0.5 animate-pulse" />
          <div>
            <strong className="block font-black text-[#2F2F2F] uppercase text-[9px] font-mono tracking-wider">AI Workload Balancer</strong>
            <p className="text-[#666666] text-[11px] font-medium mt-0.5">
              {(() => {
                const rawDemands = totalItemCount - countByType(PlannerTaskType.NEW_LEAD);
                if (rawDemands >= 8) {
                  return `Your schedule is extremely busy today with ${rawDemands} follow-ups & meetings. To protect your productivity, Synity intelligently allocated only 1 new prospect instead of your daily goal of ${prefs.newLeadsTarget}.`;
                } else if (rawDemands >= 5) {
                  return `You have moderate work demands today with ${rawDemands} core sync items. Synity balanced your bandwidth and scheduled 2 new leads today.`;
                } else {
                  return `Your CRM agenda is light today with ${rawDemands} items. Synity allocated your full daily goal of ${prefs.newLeadsTarget} fresh targets for outbound qualifying.`;
                }
              })()}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-white border border-[#D8D8D8] rounded-xl font-mono text-[10px] font-bold text-slate-700 shrink-0 uppercase tracking-wider">
          Daily Goal: {prefs.newLeadsTarget} Leads
        </span>
      </div>

      {/* 3. CORE BRIEFING OVERVIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMN A: WORKDAY AGENDA ITEMS (8/12) */}
        <div className="lg:col-span-8 space-y-5">
          {/* AI Daily Briefing card */}
          <Card className="p-5 border border-[#D8D8D8] bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-bl-full flex items-center justify-center">
              <Sparkles size={18} className="text-blue-500" />
            </div>

            <div className="space-y-4 text-left">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Current Workday Session</span>
                <h3 className="text-xl font-black font-display text-[#2F2F2F]">Good Morning, {user?.name || "Partner"} 👋</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 border-y border-[#F2F2F2] text-xs">
                <div className="space-y-1">
                  <span className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Estimated Duration</span>
                  <strong className="text-gray-800 font-mono text-base">{estimatedTimeString}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Completed Today</span>
                  <strong className="text-emerald-700 font-mono text-base">{completedCount} / {totalItemCount}</strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Primary Focus Goal</span>
                  <strong className="text-rose-700 font-extrabold text-[11px] uppercase tracking-wide">
                    {plannerItems.some(i => i.type === PlannerTaskType.FOLLOW_UP && i.priority === "URGENT")
                      ? "Resolve Overdue followups"
                      : "Outbound Qualification"}
                  </strong>
                </div>
                <div className="space-y-1">
                  <span className="block text-[8px] uppercase font-bold text-gray-400 font-mono">Agenda Status</span>
                  <strong className="text-slate-700 font-mono text-base">{completionPercentage}% Done</strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-gray-500">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  📞 {countByType(PlannerTaskType.NEW_LEAD) + countByType(PlannerTaskType.CALLBACK)} Calls
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  💬 {countByType(PlannerTaskType.FOLLOW_UP)} Follow Ups
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  🤝 {countByType(PlannerTaskType.MEETING)} Meetings
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  📄 {countByType(PlannerTaskType.PROPOSAL)} Proposals
                </span>
              </div>
            </div>
          </Card>

          {/* Dynamic Agenda Task List Filter Bar */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 border-b border-[#D8D8D8] pb-1 select-none text-[11px]">
              {[
                { label: "Full Agenda", value: "ALL", count: totalItemCount },
                { label: "Remaining", value: "TODO", count: remainingCount },
                { label: "Completed", value: "DONE", count: completedCount }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setItemFilter(opt.value as typeof itemFilter)}
                  className={`px-3 py-1.5 rounded font-bold transition-all whitespace-nowrap cursor-pointer ${
                    itemFilter === opt.value
                      ? "bg-[#4E4E49]/15 text-[#2F2F2F]"
                      : "text-gray-500 hover:text-slate-800"
                  }`}
                >
                  {opt.label} ({opt.count})
                </button>
              ))}
            </div>

            <button
              onClick={handleReGeneratePlanner}
              className="text-[10px] font-bold font-mono text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={11} />
              Re-generate Plan
            </button>
          </div>

          {/* Agenda items compiler render */}
          <div className="space-y-3">
            {getFilteredItems().length === 0 ? (
              <div className="py-16 text-center border border-dashed border-[#D8D8D8] rounded-2xl bg-white space-y-3">
                <CheckCircle2 size={36} className="mx-auto text-emerald-500 stroke-1" />
                <div>
                  <h4 className="font-bold text-xs text-[#2F2F2F]">Workspace Clear</h4>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">No tasks match selected workspace filters.</p>
                </div>
              </div>
            ) : (
              getFilteredItems().map((item, index) => {
                const linkedLeadObj = item.leadId ? leads.find(l => l.id === item.leadId) : null;
                const isItemOverdue = item.scheduledTime && new Date(item.scheduledTime) < new Date();

                return (
                  <div
                    key={item.id}
                    className={`p-4 bg-white border border-[#D8D8D8] rounded-2xl transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left relative overflow-hidden ${
                      item.status === PlannerTaskStatus.DONE
                        ? "opacity-65 border-gray-200"
                        : item.priority === "URGENT"
                        ? "border-l-4 border-l-rose-500 hover:shadow-xs"
                        : item.priority === "HIGH"
                        ? "border-l-4 border-l-amber-500 hover:shadow-xs"
                        : "border-l-4 border-l-[#8CB9D7] hover:shadow-xs"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-xs text-[#2F2F2F] truncate max-w-[190px]">
                          {item.title}
                        </span>

                        {/* Badging depending on priority */}
                        {item.priority === "URGENT" && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wide bg-rose-50 text-rose-600 border border-rose-200">
                            Overdue
                          </span>
                        )}

                        {item.scheduledTime && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
                            <Clock size={8} />
                            {(() => {
                              const date = new Date(item.scheduledTime);
                              const hrs = date.getHours();
                              const mins = date.getMinutes().toString().padStart(2, "0");
                              return `${hrs > 12 ? hrs - 12 : hrs}:${mins} ${hrs >= 12 ? "PM" : "AM"}`;
                            })()}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-xl truncate">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-400 font-mono font-bold">
                        <span>CLIENT: <strong className="text-slate-700 font-sans">{item.companyName || "Direct Contact"}</strong></span>
                        {linkedLeadObj && (
                          <span>VALUE: <strong className="text-emerald-700">{formatCurrency(linkedLeadObj.value)}</strong></span>
                        )}
                        <span>EST. TIME: <strong className="text-[#2F2F2F]">{item.estimatedMinutes} Mins</strong></span>
                      </div>
                    </div>

                    {/* Actions button */}
                    <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                      {item.status === PlannerTaskStatus.DONE ? (
                        <span className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 flex items-center gap-1 select-none">
                          <Check size={11} />
                          Complete
                        </span>
                      ) : item.status === PlannerTaskStatus.SKIPPED ? (
                        <span className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-gray-100 text-gray-500 rounded-lg border border-gray-200 select-none">
                          Skipped
                        </span>
                      ) : item.status === PlannerTaskStatus.RESCHEDULED ? (
                        <span className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-50 text-amber-700 rounded-lg border border-amber-200 select-none">
                          Rescheduled
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            const foundIdx = plannerItems.findIndex(i => i.id === item.id);
                            if (foundIdx !== -1) {
                              setActiveWorkspaceItemIndex(foundIdx);
                              setQuickNoteText("");
                              setSelectedRescheduleDate("");
                              setRescheduleError("");
                            }
                          }}
                          className="px-3.5 py-1.5 text-[10px] font-bold text-[#4E4E49] hover:bg-[#E5E3E7]/35 border border-[#D8D8D8] rounded-xl flex items-center gap-1 transition-all cursor-pointer bg-white hover:border-[#60605B]"
                        >
                          Launch Workspace
                          <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN B: STREAK AND ACHIEVEMENT CARD SIDE PANEL (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Workday Streaks */}
          <Card className="p-4 border border-[#D8D8D8] bg-white space-y-4 text-left">
            <h4 className="text-xs font-bold text-[#2F2F2F] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Flame size={14} className="text-amber-500 animate-pulse" />
              Workday Streaks & Statistics
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs text-center font-mono">
              <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl space-y-0.5">
                <span className="block text-[8px] uppercase font-bold text-gray-400">Current Streak</span>
                <strong className="text-amber-700 font-extrabold text-lg flex items-center justify-center gap-1">
                  <Flame size={16} fill="#F59E0B" className="stroke-none" />
                  {streak.currentStreak} Days
                </strong>
              </div>
              <div className="p-3 bg-blue-50/30 border border-blue-100 rounded-xl space-y-0.5">
                <span className="block text-[8px] uppercase font-bold text-gray-400">Longest Streak</span>
                <strong className="text-blue-700 font-extrabold text-lg">
                  {streak.longestStreak} Days
                </strong>
              </div>
            </div>

            {/* Completion percentage indicator */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase font-mono">
                <span>Daily Completion</span>
                <span className="text-gray-800">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase font-mono">
                <span>Weekly Average Progress</span>
                <span className="text-gray-800">{streak.weeklyCompletion}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${streak.weeklyCompletion}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Gamified Achievements Locker Board */}
          <Card className="p-4 border border-[#D8D8D8] bg-white space-y-4 text-left">
            <h4 className="text-xs font-bold text-[#2F2F2F] font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Award size={15} className="text-blue-600 animate-bounce" />
              Gamified CRM Milestones
            </h4>

            <div className="space-y-3">
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                    ach.unlocked
                      ? "bg-emerald-50/40 border-emerald-100"
                      : "bg-slate-50/50 border-slate-100 grayscale opacity-60"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl text-xs flex items-center justify-center ${
                      ach.unlocked
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {ach.id === "ach-4" ? <Trophy size={14} /> : ach.id === "ach-3" ? <Flame size={14} /> : <Award size={14} />}
                  </div>

                  <div className="space-y-0.5 text-left text-xs flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <strong className="font-extrabold text-[#2F2F2F]">{ach.title}</strong>
                      {ach.unlocked && (
                        <span className="text-[8px] font-mono text-emerald-600 font-bold uppercase tracking-wider">Unlocked</span>
                      )}
                    </div>
                    <p className="text-gray-400 font-medium text-[10px] leading-relaxed truncate">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. DIALOG: ADJUST TARGET LEADS TARGET FORM */}
      {isEditingPrefs && (
        <Modal
          isOpen={isEditingPrefs}
          onClose={() => setIsEditingPrefs(false)}
          title={
            <span className="flex items-center gap-2 font-black text-slate-800 font-display">
              <Settings size={16} />
              Customize Sales Targets
            </span>
          }
          size="sm"
        >
          <form onSubmit={handleSetupSubmit} className="space-y-4 text-xs text-left">
            <p className="text-gray-500 leading-relaxed text-[11px]">
              Set the number of daily outbound qualifiers Synity's Workload Balancer compiles each morning.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase font-bold text-gray-400 font-mono">Daily Target prospects</label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={customTargetInput || prefs.newLeadsTarget}
                onChange={e => setCustomTargetInput(e.target.value)}
                className="block w-full bg-slate-50 border border-[#D8D8D8] rounded-lg px-3 py-2.5 outline-none text-[#2F2F2F] text-xs font-mono"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditingPrefs(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="font-bold">
                Save Target & Rebuild
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. DIALOG: YESTERDAY WORKDAY UNFINISHED REVIEW */}
      {isReviewOpen && unfinishedLeadsToReview.length > 0 && (
        <Modal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          title={
            <span className="flex items-center gap-2 text-[#2F2F2F] font-bold font-display">
              <AlertTriangle size={16} className="text-amber-500 animate-bounce" />
              Yesterday Workday Retrospective
            </span>
          }
          size="md"
        >
          <div className="space-y-4 text-xs text-left">
            <p className="text-gray-500 leading-normal text-[11px]">
              Synity detected uncompleted agenda items from previous workday blocks. Review their current statuses to clean database logs and initialize today's focus map.
            </p>

            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1 space-y-3">
              {unfinishedLeadsToReview.map(l => (
                <div key={l.id} className="pt-3 first:pt-0 space-y-2 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="block text-slate-800 text-xs">{l.company}</strong>
                      <span className="block text-[10px] text-gray-400">Advisor contact: {l.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
                      Unresolved
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                    <button
                      onClick={() => handleYesterdayReviewResolve(l.id, LeadStatus.INTERESTED)}
                      className="px-2 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded-lg text-center cursor-pointer hover:bg-emerald-100 transition-colors"
                    >
                      Interested
                    </button>
                    <button
                      onClick={() => handleYesterdayReviewResolve(l.id, "CALL_AGAIN")}
                      className="px-2 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 font-bold rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      Call Again
                    </button>
                    <button
                      onClick={() => handleYesterdayReviewResolve(l.id, LeadStatus.PROPOSAL)}
                      className="px-2 py-1.5 bg-purple-50 text-purple-800 border border-purple-200 font-bold rounded-lg text-center cursor-pointer hover:bg-purple-100 transition-colors"
                    >
                      Proposal Sent
                    </button>
                    <button
                      onClick={() => handleYesterdayReviewResolve(l.id, "LOST")}
                      className="px-2 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 font-bold rounded-lg text-center cursor-pointer hover:bg-rose-100 transition-colors"
                    >
                      Lost Deal
                    </button>
                    <button
                      onClick={() => handleYesterdayReviewResolve(l.id, LeadStatus.CLOSED_WON)}
                      className="px-2 py-1.5 bg-teal-50 text-teal-800 border border-teal-200 font-bold rounded-lg text-center cursor-pointer hover:bg-teal-100 transition-colors"
                    >
                      Closed Won
                    </button>
                    <button
                      onClick={() => {
                        // Just bypass/delete item for tomorrow
                        setUnfinishedLeadsToReview(prev => {
                          const remaining = prev.filter(item => item.id !== l.id);
                          if (remaining.length === 0) {
                            setIsReviewOpen(false);
                            generateTodayPlan(prefs.newLeadsTarget, true);
                          }
                          return remaining;
                        });
                      }}
                      className="px-2 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-lg text-center cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                      Bypass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

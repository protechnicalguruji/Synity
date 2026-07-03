/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check, Phone, Handshake, MessageSquare, FileText, Calendar, Clock } from "lucide-react";
import { Card } from "../ui/Card";
import { Task, TaskStatus } from "../../types";
import { motion, AnimatePresence } from "motion/react";
import { formatDate } from "../../utils";

interface TaskCardProps {
  tasks: Task[];
  onToggleTaskStatus: (id: string) => void;
  onAddTaskClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  tasks,
  onToggleTaskStatus,
  onAddTaskClick
}) => {
  // Sort tasks: Active first, then by priority/due date
  const activeTasks = tasks.slice(0, 6); // Display up to 6 tasks for clean timeline

  const getTaskCategoryInfo = (title: string, desc?: string) => {
    const text = (title + " " + (desc || "")).toLowerCase();
    if (text.includes("call") || text.includes("phone")) {
      return {
        label: "Call Action",
        color: "bg-blue-50 border-blue-200 text-blue-600",
        icon: <Phone size={13} />
      };
    }
    if (text.includes("meet") || text.includes("demo") || text.includes("sync")) {
      return {
        label: "Meeting Sync",
        color: "bg-amber-50 border-amber-200 text-amber-600",
        icon: <Handshake size={13} />
      };
    }
    if (text.includes("follow") || text.includes("touch") || text.includes("whatsapp")) {
      return {
        label: "Follow Up",
        color: "bg-purple-50 border-purple-200 text-purple-600",
        icon: <MessageSquare size={13} />
      };
    }
    return {
      label: "Proposal Deliverable",
      color: "bg-emerald-50 border-emerald-200 text-emerald-600",
      icon: <FileText size={13} />
    };
  };

  return (
    <Card
      id="todays-tasks-widget"
      title={<span className="font-display font-bold text-[#2F2F2F]">Workday Action Timeline</span>}
      description="Sequenced checklist of high-priority client deliverables and sales touchpoints."
      headerActions={
        <button
          onClick={onAddTaskClick}
          className="text-xs font-bold text-[#4E4E49] hover:text-[#8CB9D7] cursor-pointer hover:underline"
        >
          Manage Backlog
        </button>
      }
    >
      {activeTasks.length === 0 ? (
        <div className="text-center py-12 text-xs text-gray-500 border border-dashed border-[#D8D8D8] rounded-xl bg-white">
          <Calendar size={20} className="mx-auto text-gray-400 mb-2" />
          <p className="font-semibold">You're all caught up!</p>
          <p className="text-[10px] text-gray-400 mt-1">No pending checklist items scheduled for today.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 mt-3 text-left">
          {/* Vertical timeline line connector */}
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-[#E5E3E7]" />

          {activeTasks.map((task) => {
            const isDone = task.status === TaskStatus.DONE;
            const category = getTaskCategoryInfo(task.title, task.description);

            return (
              <div key={task.id} className="relative flex items-start gap-4 group">
                {/* Timeline node */}
                <div className={`absolute -left-5 mt-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                  isDone ? "bg-[#4E4E49] border-[#4E4E49]" : "bg-white border-[#D8D8D8] group-hover:border-[#60605B]"
                } transition-colors z-10 flex items-center justify-center`}>
                  {isDone && <div className="h-1 w-1 bg-white rounded-full" />}
                </div>

                {/* Task card element with Framer Motion check scale */}
                <div className={`flex-1 p-3.5 border rounded-xl transition-all duration-200 flex items-start justify-between gap-3 ${
                  isDone
                    ? "bg-[#E5E3E7]/15 border-[#D8D8D8]/50 opacity-60"
                    : "bg-white border-[#D8D8D8] hover:border-[#60605B] shadow-2xs"
                }`}>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Category Label */}
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${category.color}`}>
                        {category.icon}
                        <span>{category.label}</span>
                      </span>
                      {task.leadName && (
                        <span className="text-[9px] font-bold text-gray-400 truncate max-w-xs font-mono bg-gray-50 px-1 rounded">
                          @ {task.leadName}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <p className={`text-xs font-bold text-[#2F2F2F] leading-tight truncate ${isDone ? "line-through text-gray-400" : ""}`}>
                      {task.title}
                    </p>
                    
                    {task.description && (
                      <p className={`text-[10px] leading-relaxed ${isDone ? "text-gray-400" : "text-[#666666]"} line-clamp-2`}>
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2.5 pt-0.5 text-[9px] text-gray-400 font-mono font-bold">
                      <span className="flex items-center gap-0.5"><Clock size={10} /> DUE: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>

                  {/* Interactive Animating Checkbox */}
                  <div className="shrink-0 pt-0.5">
                    <button
                      onClick={() => onToggleTaskStatus(task.id)}
                      className={`h-5.5 w-5.5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        isDone
                          ? "bg-[#4E4E49] border-[#4E4E49] text-white"
                          : "bg-white border-[#D8D8D8] hover:border-[#4E4E49]"
                      }`}
                      title={isDone ? "Mark as Active" : "Mark as Completed"}
                    >
                      <AnimatePresence mode="wait">
                        {isDone ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

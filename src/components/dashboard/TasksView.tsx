/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Calendar,
  AlertTriangle,
  Users,
  Search,
  Trash2,
  ListFilter
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { EmptyState } from "../ui/EmptyState";
import { Task, TaskPriority, TaskStatus, Lead } from "../../types";
import { formatDate, getPriorityStyle } from "../../utils";

interface TasksViewProps {
  tasks: Task[];
  leads: Lead[];
  onAddTask: (task: Omit<Task, "id">) => void;
  onToggleTaskStatus: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  leads,
  onAddTask,
  onToggleTaskStatus,
  onDeleteTask,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [selectedLeadId, setSelectedLeadId] = useState("");

  // Handle addition
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) return;

    const matchedLead = leads.find((l) => l.id === selectedLeadId);

    onAddTask({
      title: newTitle,
      description: newDesc,
      dueDate: new Date(newDueDate).toISOString(),
      priority: newPriority,
      status: TaskStatus.TODO,
      leadId: selectedLeadId || undefined,
      leadName: matchedLead ? matchedLead.name : undefined,
    });

    // Reset Form
    setNewTitle("");
    setNewDesc("");
    setNewDueDate("");
    setNewPriority(TaskPriority.MEDIUM);
    setSelectedLeadId("");
    setShowAddForm(false);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.leadName && task.leadName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "TODO" && task.status !== TaskStatus.DONE) ||
      (filterStatus === "DONE" && task.status === TaskStatus.DONE);

    const matchesPriority = filterPriority === "ALL" || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold font-display text-[#2F2F2F] tracking-tight">Workday Sales Backlog</h2>
          <p className="text-xs text-[#666666]">Plan touch-points, prepare custom proposals, and track client deliverables.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          icon={<Plus size={15} />}
        >
          {showAddForm ? "Cancel Form" : "Schedule Task"}
        </Button>
      </div>

      {/* Grid: Form (if open) and Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Rapid Task Creation Form Panel */}
        {showAddForm && (
          <div className="lg:col-span-1">
            <Card title="Schedule New Action" description="Create actionable follow-ups synced directly with active client files.">
              <form onSubmit={handleCreateTask} className="space-y-4 text-left mt-3">
                <Input
                  label="Task Title"
                  placeholder="e.g. Email bespoke localization brief"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2F2F2F]">Action Description</label>
                  <textarea
                    rows={2}
                    className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-sm px-4 py-2 text-[#2F2F2F] outline-none focus:border-[#4E4E49] focus:ring-1 focus:ring-[#4E4E49]"
                    placeholder="Provide context details or core negotiation deliverables"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2F2F2F] mb-1.5">Priority</label>
                    <select
                      className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2.5 text-[#2F2F2F] outline-none"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    >
                      <option value={TaskPriority.LOW}>Low</option>
                      <option value={TaskPriority.MEDIUM}>Medium</option>
                      <option value={TaskPriority.HIGH}>High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2F2F2F] mb-1.5">Due Date</label>
                    <input
                      type="date"
                      className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2 text-[#2F2F2F] outline-none"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2F2F2F] block">Link Active Lead (Optional)</label>
                  <select
                    className="block w-full rounded-lg border border-[#D8D8D8] bg-white text-xs px-3 py-2.5 text-[#2F2F2F] outline-none"
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                  >
                    <option value="">No Lead Linked</option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.company})
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" variant="primary" size="sm" className="w-full">
                  Create Workday Entry
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* Task listings view */}
        <div className={showAddForm ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"}>
          
          {/* Filters card */}
          <Card className="py-3 px-4.5">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              <div className="relative flex-1 w-full max-w-xs">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#666666]/75">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Filter task labels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-[#D8D8D8] rounded-lg pl-9 pr-3 py-2 text-[#2F2F2F] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* Status toggles */}
                <div className="flex bg-[#E5E3E7]/40 rounded-lg p-0.5 border border-[#D8D8D8]/50">
                  <button
                    onClick={() => setFilterStatus("ALL")}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-md cursor-pointer ${
                      filterStatus === "ALL" ? "bg-white text-[#2F2F2F] shadow-2xs" : "text-[#666666] hover:text-[#2F2F2F]"
                    }`}
                  >
                    All Pending
                  </button>
                  <button
                    onClick={() => setFilterStatus("TODO")}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-md cursor-pointer ${
                      filterStatus === "TODO" ? "bg-white text-[#2F2F2F] shadow-2xs" : "text-[#666666] hover:text-[#2F2F2F]"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterStatus("DONE")}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-md cursor-pointer ${
                      filterStatus === "DONE" ? "bg-white text-[#2F2F2F] shadow-2xs" : "text-[#666666] hover:text-[#2F2F2F]"
                    }`}
                  >
                    Completed
                  </button>
                </div>

                {/* Priority Selection */}
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="text-xs bg-white border border-[#D8D8D8] rounded-lg px-2.5 py-1.5 text-[#2F2F2F] outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
              </div>

            </div>
          </Card>

          {/* Render List items */}
          {filteredTasks.length === 0 ? (
            <EmptyState
              title="Workday backlog is clear"
              description="No tasks match your selection criteria. Create a new follow-up milestone to build momentum."
              actionText="Add New Action"
              onAction={() => setShowAddForm(true)}
            />
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((t) => {
                const priorityStyle = getPriorityStyle(t.priority);
                const isCompleted = t.status === TaskStatus.DONE;

                return (
                  <div
                    key={t.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? "bg-[#E5E3E7]/15 border-[#D8D8D8]/60 opacity-65"
                        : "bg-white border-[#D8D8D8] hover:border-[#60605B] shadow-2xs"
                    }`}
                  >
                    {/* Checkbox trigger */}
                    <button
                      onClick={() => onToggleTaskStatus(t.id)}
                      className="mt-0.5 h-5 w-5 rounded-md border border-[#D8D8D8] flex items-center justify-center cursor-pointer hover:border-[#60605B] transition-colors"
                      title={isCompleted ? "Mark active" : "Mark completed"}
                    >
                      {isCompleted && <span className="h-2.5 w-2.5 rounded bg-[#4E4E49]" />}
                    </button>

                    {/* Content text */}
                    <div className="flex-1 text-left space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={`text-sm font-bold text-[#2F2F2F] leading-tight truncate ${
                          isCompleted ? "line-through text-gray-400" : ""
                        }`}>
                          {t.title}
                        </p>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${priorityStyle.bg} ${priorityStyle.text}`}>
                          <span className={`h-1 w-1 rounded-full ${priorityStyle.dot}`} />
                          {t.priority}
                        </span>
                      </div>

                      {t.description && (
                        <p className={`text-xs ${isCompleted ? "text-gray-400" : "text-[#666666]"} leading-normal`}>
                          {t.description}
                        </p>
                      )}

                      {/* Footer tags */}
                      <div className="flex flex-wrap items-center gap-4 pt-1 text-[10px] text-gray-500 font-mono">
                        <span className="flex items-center gap-1 font-semibold text-gray-400 uppercase">
                          <Calendar size={11} /> {formatDate(t.dueDate)}
                        </span>
                        {t.leadName && (
                          <span className="flex items-center gap-1 text-[#4E4E49] bg-[#E5E3E7]/40 border border-[#D8D8D8]/50 rounded-md px-1.5 py-0.5 font-bold">
                            <Users size={11} /> {t.leadName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action deletion */}
                    <button
                      onClick={() => onDeleteTask(t.id)}
                      className="p-1 rounded text-gray-400 hover:text-red-500 cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

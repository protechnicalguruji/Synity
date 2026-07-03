import React, { useState, useEffect } from "react";
import { Clock, Plus, Edit2, Check, X, FileText, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";

interface NoteEntry {
  id: string;
  text: string;
  timestamp: string;
}

interface LeadNotesProps {
  notesString: string;
  onSaveNotes: (updatedNotesString: string) => void;
}

export const LeadNotes: React.FC<LeadNotesProps> = ({
  notesString,
  onSaveNotes
}) => {
  const [entries, setEntries] = useState<NoteEntry[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  // Parse notes on load
  useEffect(() => {
    if (!notesString) {
      setEntries([]);
      return;
    }

    try {
      // Look for custom separator [NOTE_ID|TIMESTAMP]
      const blocks = notesString.split(/\[NOTE_(\d+)\|([^\]]+)\]/g);
      const parsed: NoteEntry[] = [];
      
      // If no custom separator, treat the whole block as one initial note
      if (blocks.length <= 1) {
        parsed.push({
          id: "initial",
          text: notesString,
          timestamp: new Date().toISOString()
        });
      } else {
        // First item is usually empty if string starts with marker
        let i = 1;
        while (i < blocks.length) {
          const id = blocks[i];
          const ts = blocks[i + 1];
          const text = blocks[i + 2]?.trim();
          
          if (id && ts && text) {
            parsed.push({
              id,
              timestamp: ts,
              text
            });
          }
          i += 3;
        }
      }
      setEntries(parsed.reverse()); // Newest first in UI
    } catch (e) {
      // Fallback
      setEntries([{
        id: "initial",
        text: notesString,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [notesString]);

  // Serialize and emit changes
  const saveAndEmit = (updatedEntries: NoteEntry[]) => {
    // Reverse back to chronological before saving
    const chronological = [...updatedEntries].reverse();
    const serialized = chronological
      .map((e) => `[NOTE_${e.id}|${e.timestamp}]\n${e.text}`)
      .join("\n\n");
    
    onSaveNotes(serialized);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const newEntry: NoteEntry = {
      id: String(Date.now()),
      text: newNote.trim(),
      timestamp: new Date().toISOString()
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    setNewNote("");
    saveAndEmit(updated);
  };

  const handleStartEdit = (entry: NoteEntry) => {
    setEditingId(entry.id);
    setEditingText(entry.text);
  };

  const handleSaveEdit = (id: string) => {
    const updated = entries.map((e) => {
      if (e.id === id) {
        return { ...e, text: editingText.trim() };
      }
      return e;
    });
    setEntries(updated);
    setEditingId(null);
    setEditingText("");
    saveAndEmit(updated);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to remove this specific note?")) {
      const updated = entries.filter((e) => e.id !== id);
      setEntries(updated);
      saveAndEmit(updated);
    }
  };

  return (
    <div className="space-y-4 text-left">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1.5">
        <FileText size={13} />
        Executive Sales Notes ({entries.length})
      </h4>

      {/* Note Creator Form */}
      <form onSubmit={handleAddNote} className="space-y-2">
        <textarea
          placeholder="Type a new timestamped follow-up note, client preference, or custom detail..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
          className="w-full text-xs bg-white border border-[#D8D8D8] rounded-xl px-3 py-2.5 text-[#2F2F2F] outline-none focus:border-[#4E4E49] focus:ring-1 focus:ring-[#4E4E49]"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="xs"
            className="bg-[#4E4E49] hover:bg-[#3D3D38] text-white flex items-center gap-1"
          >
            <Plus size={12} />
            Add Note
          </Button>
        </div>
      </form>

      {/* Notes List */}
      {entries.length === 0 ? (
        <div className="text-center py-6 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
          <p className="text-xs text-gray-400">No executive notes recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 bg-gray-50/70 border border-[#D8D8D8]/60 rounded-xl space-y-2 relative group"
            >
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-1 font-mono">
                  <Clock size={10} />
                  {new Date(entry.timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editingId !== entry.id && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(entry)}
                        className="p-1 hover:text-[#2F2F2F] hover:bg-gray-200 rounded-md"
                        title="Edit note"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(entry.id)}
                        className="p-1 hover:text-red-600 hover:bg-red-50 rounded-md"
                        title="Delete note"
                      >
                        <Trash2 size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingId === entry.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={2}
                    className="w-full text-xs bg-white border border-[#D8D8D8] rounded-lg px-2 py-1.5 outline-none focus:border-[#4E4E49]"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <X size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(entry.id)}
                      className="p-1 text-emerald-600 hover:text-emerald-700 font-bold"
                    >
                      <Check size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#2F2F2F] whitespace-pre-wrap leading-relaxed">
                  {entry.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

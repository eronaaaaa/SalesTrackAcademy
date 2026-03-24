"use client";
import { useState } from "react";

interface BulkAssignBarProps {
  selectedCount: number;
  availableCourses: { id: number; title: string }[];
  isAssigning: boolean;
  onAssign: (courseId: string) => void;
  onCancel: () => void;
}

export default function BulkAssignBar({
  selectedCount,
  availableCourses,
  isAssigning,
  onAssign,
  onCancel,
}: BulkAssignBarProps) {
  const [selectedCourseId, setSelectedCourseId] = useState("");

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10 z-50 border border-slate-700/50">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Selected</span>
        <span className="font-bold">{selectedCount} Agents</span>
      </div>

      <div className="h-8 w-[1px] bg-slate-700 dark:bg-slate-200" />

      <div className="flex items-center gap-3">
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          disabled={isAssigning}
          className="bg-slate-800 dark:bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select a course...</option>
          {availableCourses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        <button
          onClick={() => onAssign(selectedCourseId)}
          disabled={!selectedCourseId || isAssigning}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
        >
          {isAssigning ? "Assigning..." : "Confirm"}
        </button>

        <button onClick={onCancel} className="text-xs font-bold hover:underline opacity-60">
          Cancel
        </button>
      </div>
    </div>
  );
}
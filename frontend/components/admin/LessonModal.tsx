import { useState } from "react";
import { ContentType, Lesson } from "@/types/course";

interface LessonForm {
  title: string;
  contentUrl: string;
  contentType: string;
  passingScore: number;
  order: number;
}

interface LessonModalProps {
  editingLesson: Lesson | null;
  nextOrder: number;
  onSave: (form: LessonForm) => void;
  onClose: () => void;
}

export default function LessonModal({
  editingLesson,
  nextOrder,
  onSave,
  onClose,
}: LessonModalProps) {
  const [form, setForm] = useState<LessonForm>({
    title: editingLesson?.title ?? "",
    contentUrl: editingLesson?.contentUrl ?? "",
    contentType: editingLesson?.contentType ?? "VIDEO",
    passingScore: editingLesson?.passingScore ?? 70,
    order: editingLesson?.order ?? nextOrder,
  });

  const update = (field: keyof LessonForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl">
        <h2 className="text-2xl font-black mb-6 dark:text-white">
          {editingLesson?.id ? "Edit" : "New"} Lesson
        </h2>

        <div className="space-y-4">
          <input
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white"
            placeholder="Title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />

          <select
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white"
            value={form.contentType}
            onChange={(e) => update("contentType", e.target.value as ContentType)}
          >
            <option value="VIDEO">Video</option>
            <option value="AUDIO">Audio</option>
            <option value="PDF">PDF</option>
          </select>

          <input
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white"
            placeholder="URL"
            value={form.contentUrl}
            onChange={(e) => update("contentUrl", e.target.value)}
          />

          <input
            type="number"
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white"
            placeholder="Passing Score"
            value={form.passingScore}
            onChange={(e) => update("passingScore", parseInt(e.target.value))}
          />

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onSave(form)}
              className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}